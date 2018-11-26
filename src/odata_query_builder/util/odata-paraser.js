import {filter as ODataV4ParserFilter} from 'odata-v4-parser';

const CONJUNCTIONS = {
	AND: 'and',
	OR: 'or'
}

const GROUP = 'group';

const RELATIONAL_OPERATORS = {
	EQ: 'eq',
	GE: 'ge',
	GT: 'gt',
	LE: 'le',
	LT: 'lt',
	NE: 'ne'
}

const TYPES = {
	BOOLEAN: 'boolean',
	DATE: 'date',
	NUMBER: 'number',
	STRING: 'string'
}

/**
 * Maps Odata-v4-parser generated AST expression names to internally used 
 * constants.
 */
const oDataV4ParserNameMap = {
	AndExpression: CONJUNCTIONS.AND,
	BoolParenExpression: GROUP,
	EqualsExpression: OPERATORS.EQ,
	GreaterOrEqualsExpression: OPERATORS.GE,
	GreaterThanExpression: OPERATORS.GT,
	LesserOrEqualsExpression: OPERATORS.LE,
	LesserThanExpression: OPERATORS.LT,
	NotEqualsExpression: OPERATORS.NE,
	OrExpression: CONJUNCTIONS.OR,
};

/**
 * Wraps a node in a grouping node
 * @param {*} {oDataASTNode, prevConjunction}
 * @returns Object representing the grouping
 */
function addNewGroup({oDataASTNode, prevConjunction}) {
	return {
		lastNodeWasGroup: false,
		prevConjunction,
		oDataASTNode: {type: 'BoolParenExpression', value: oDataASTNode}
	};
}

/**
 * Recursively traverses the criteria object to build an oData filter query 
 * string.
 * @param {object} criteria
 * @param {string} queryConjunction
 * @returns
 */
function buildQueryString(criteria, queryConjunction) {
	let queryString = '';

	criteria.forEach(
		(criterion, index) => {
			const {
				conjunctionName,
				items,
				operatorName,
				propertyName,
				value
			} = criteria;

			if (index > 0) {
				queryString = queryString.concat(` ${queryConjunction} `);
			}

			if (conjunctionName) {
				queryString = queryString.concat(
					`(${buildQueryString(items, conjunctionName)})`
				);
			}
			else if (RELATIONAL_OPERATORS.includes(operatorName)) {
				queryString = queryString.concat(
					`${propertyName} ${operatorName} '${value}'`
				);
			}
			else if (FUNCTIONAL_OPERATORS.includes(operatorName)) {
				queryString = queryString.concat(
					`${operatorName} (${propertyName}, '${value}')`
				);
			}
		}
	);

	return queryString;
};

/**
 * Gets the internal name of a child expression from the oDataV4Parser name
 * @param {*} oDataASTNode
 * @returns String value of the internal name
 */
function getChildExpressionName(oDataASTNode) {
	return getExpressionName(oDataASTNode.value.type);
}

/**
 * Gets the conjunction of the group or returns AND as a default
 * @param {object} oDataASTNode
 * @returns A conjunction name
 */
function getConjunctionForGroup(oDataASTNode) {
	const childExpressionName = getChildExpressionName(oDataASTNode);

	return CONJUNCTIONS.includes(childExpressionName) ? childExpressionName : AND;
}

/**
 * Gets the internal name of an expression from the oDataV4Parser name
 * @param {*} oDataASTNode
 * @returns String value of the internal name
 */
function getExpressionName(oDataASTNode) {
	return oDataV4ParserNameMap[oDataASTNode.type];
}

/**
 * Returns the next expression in the syntax tree that is not a grouping
 * @param {*} oDataASTNode
 * @returns String value of the internal name of the next expression
 */
const getNextNonGroupExpressionName = oDataASTNode => {
	let returnValue;

	if (oDataASTNode.value.type === 'BoolParentExpression') {
		returnValue = getNextNonGroupExpressionName(oDataASTNode.value);
	}
	else {
		returnValue = oDataASTNode.value.left ?
			oDataASTNode.value.left :
			oDataASTNode.value;
	}

	return getExpressionName(returnValue);
};

/**
 * Checks if a grouping has different conjunctions (e.g. (x AND y OR z))
 * @param {*} context
 * @returns boolean of whether a grouping has different conjunctions
 */
function hasDifferentConjunctions(context) {
	return prevConjunction !== oDataASTNode.type && !lastNodeWasGroup
}

/**
 * Checks if the group is needed; It is unneccesary when there are multiple 
 * groupings in a row, when the conjunction directly outside the group is the 
 * same as the one inside or there is no conjunction within a grouping.
 * @param {*} {lastNodeWasGroup, oDataASTNode, prevConjunction}
 * @returns a boolean of whether a group is neccessary
 */
function isRedundantGroup({lastNodeWasGroup, oDataASTNode, prevConjunction}) {
	const nextNodeType = getNextNonGroupExpressionName(oDataASTNode);

	return lastNodeWasGroup || prevConjunction === nextNodeType ||
		!CONJUNCTIONS.includes(getExpressionName(nextNodeType))
}

/**
 * Removes a grouping node and returns the child node
 * @param {*} {oDataASTNode, prevConjunction}
 * @returns Object representing the operation inside the grouping
 */
function skipGroup({oDataASTNode, prevConjunction}) {
	return {
		lastNodeWasGroup: true,
		prevConjunction,
		oDataASTNode: oDataASTNode.value
	};
}

/**
 * Converts an OData filter query string to an object that can be used by the
 * criteria builder
 * @param {string} queryString
 * @returns Criteria representation of the query string
 */
function translateQueryToCriteria(queryString) {
	const oDataAST = ODataV4ParserFilter(queryString);

	return toCriteria({oDataAST})[0];
};

/**
 * Recursively transforms the AST generated by the odata-v4-parser library into
 * a shape the criteria builder expects. Returns an array so that left and right
 * arguments can be concatenated together.
 * @param {object} context {
 * 	lastNodeWasGroup,
 * 	oDataASTNode,
 * 	prevConjunction
 * }
 * @returns Criterion representation of an AST expression node in an array
 */
function toCriteria(context) {
	const {oDataASTNode} = context;
	
	const expressionName = getExpressionName(oDataASTNode);

	let criterion;

	if (RELATIONAL_OPERATORS[expressionName]) {
		criterion = transformOperatorNode(arguments);
	}
	else if (CONJUNCTIONS[expressionName]) {
		criterion = transformConjunctionNode(arguments);
	}
	else if (expressionName === GROUP) {
		criterion = transformGroupNode(arguments);
	}

	return criterion;
};

/**
 * Transforms conjunction expression node into a criterion for the criteria 
 * builder. If it comes across a grouping sharing an AND and OR conjunction, it
 * will add a new grouping so the criteria builder doesn't require a user to 
 * know operator precedence.
 * @param {object} context {
 * 	lastNodeWasGroup,
 * 	oDataASTNode,
 * 	prevConjunction
 * }
 * @returns an array containing the concatenated left and right values of a 
 * conjunction expression or a new grouping.
 */
function transformConjunctionNode (context) {
	const {oDataASTNode, prevConjunction} = context;

	const conjunctionType = oDataASTNode.type;
	const nextNode = oDataASTNode.value;

	return hasDifferentConjunctions(context) ?
		toCriteria(addNewGroup(context)) :
		[...toCriteria(
			{
				prevConjunction: conjunctionType,
				oDataASTNode: nextNode.left
			}
		),
		...toCriteria(
			{
				prevConjunction: conjunctionType,
				oDataASTNode: nextNode.right
			}
		)]
		
};

/**
 * Transforms a group expression node into a criterion for the criteria 
 * builder. If it comes across a grouping that is redundent (doesn't provide 
 * readibility improvements, superfluous to order of operations), it will remove
 * it.
 * @param {object} context {
 * 	lastNodeWasGroup,
 * 	oDataASTNode,
 * 	prevConjunction
 * }
 * @returns Criterion representation of an AST expression node in an array
 */
function transformGroupNode(context) {
	const {oDataASTNode, prevConjunction} = context;

	return isRedundantGroup(context) ?
		toCriteria(skipGroup(context)) : 
		[{
			conjunctionName: getConjunctionForGroup(oDataASTNode),
			items: [...toCriteria(
				{
					lastNodeWasGroup: true,
					prevConjunction,
					oDataASTNode: oDataASTNode.value
				}
			)]
		}];
};

/**
 * Transform an operator expression node into a criterion for the criteria 
 * builder.
 * @param {object} {oDataASTNode}
 * @returns an array containing the object representation of an operator 
 * criterion
 */
function transformOperatorNode({oDataASTNode}) {
	return [
		{
			operatorName: getExpressionName(oDataASTNode),
			propertyName: oDataASTNode.value.left.raw,
			value: oDataASTNode.value.right.raw.replace(/['"]+/g, '')
		}
	];
};

const SUPPORTED_CONJUNCTIONS = [
	{
		label: 'and',
		name: AND
	},
	{
		label: 'or',
		name: OR
	}
];

const SUPPORTED_PROPERTY_TYPE_OPERATORS = {
	BOOLEAN: [EQ, NE],
	DATE: [EQ, GE, GT, LE, LT, NE],
	NUMBER: [EQ, GE, GT, LE, LT, NE],
	STRING: [EQ, NE]
}

const SUPPORTED_OPERATORS = [
	{
		label: 'equals',
		name: EQ
	},
	{
		label: 'greater-than-or-equals',
		name: GE
	},
	{
		label: 'greater-than',
		name: GT
	},
	{
		label: 'less-than-or-equals',
		name: LE
	},
	{
		label: 'less-than',
		name: LT
	},
	{
		label: 'not-equals',
		name: NE
	}
];

export {
	buildQueryString,
	SUPPORTED_CONJUNCTIONS,
	SUPPORTED_OPERATORS,
	SUPPORTED_PROPERTY_TYPE_OPERATORS,
	translateQueryToCriteria
};