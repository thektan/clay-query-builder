import React from 'react';
import PropTypes from 'prop-types';
import ClayCriteriaBuilder from './ClayCriteriaBuilder';
import {filter} from 'odata-v4-parser';

const AND = 'and';
const CONTAINS = 'contains';
const EQ = 'eq';
const GE = 'ge';
const GROUP = 'group';
const GT = 'gt';
const LE = 'le';
const LT = 'lt';
const NE = 'ne';
const OR = 'or';

const BOOLEAN = 'boolean';
const DATE = 'data';
const NUMBER = 'number';
const STRING = 'string';

const conjunctions = [
	{
		label: 'and',
		name: AND
	},
	{
		label: 'or',
		name: OR
	}
];

const FUNCTIONAL_OPERATORS = [CONTAINS];
const CONJUNCTIONS = [AND, OR];
const RELATIONAL_OPERATORS = [EQ, GE, GT, LE, LT, NE];

const operators = [
	{
		label: 'equals',
		name: EQ,
		supportedTypes: [BOOLEAN, DATE, NUMBER, STRING]
	},
	{
		label: 'greater-than-or-equals',
		name: GE,
		supportedTypes: [DATE, NUMBER]
	},
	{
		label: 'greater-than',
		name: GT,
		supportedTypes: [DATE, NUMBER]
	},
	{
		label: 'less-than-or-equals',
		name: LE,
		supportedTypes: [DATE, NUMBER]
	},
	{
		label: 'less-than',
		name: LT,
		supportedTypes: [DATE, NUMBER]
	},
	{
		label: 'not-equals',
		name: NE,
		supportedTypes: [BOOLEAN, DATE, NUMBER, STRING]
	}
];

const comparatorTransformation = ({
	lastNodeWasGroup,
	prevConjunction,
	queryAST
}) => {
	return (prevConjunction === queryAST.type || lastNodeWasGroup) ?
		[
			...toCriteriaMap({
				prevConjunction: queryAST.type,
				queryAST: queryAST.value.left
			}),
			...toCriteriaMap({
				prevConjunction: queryAST.type,
				queryAST: queryAST.value.right
			})
		] :
		toCriteriaMap(addNewGroup(queryAST, prevConjunction));
};

const addNewGroup = (queryAST, prevConjunction) => ({
	lastNodeWasGroup: false,
	prevConjunction,
	queryAST: {type: 'BoolParenExpression', value: queryAST}
});

const skipGroup = (queryAST, prevConjunction) => ({
	lastNodeWasGroup: true,
	prevConjunction,
	queryAST: queryAST.value
});

const groupTransformation = ({lastNodeWasGroup, prevConjunction, queryAST}) => {
	const nextNodeType = getNextNonGroupNodeType(queryAST);

	if (
		lastNodeWasGroup ||
		prevConjunction === nextNodeType ||
		isNotConjunction(nextNodeType)
	) {
		return toCriteriaMap(skipGroup(queryAST, prevConjunction));
	}
	else if (queryAST.value.left) {
		const childType = getChildNodeTypeName(queryAST);

		return [
			{
				conjunctionName: CONJUNCTIONS.includes(childType)
					? childType
					: AND,
				items: [
					...toCriteriaMap({
						lastNodeWasGroup: true,
						prevConjunction: queryAST.type,
						queryAST: queryAST.value.left
					}),
					...toCriteriaMap({
						lastNodeWasGroup: true,
						prevConjunction: queryAST.type,
						queryAST: queryAST.value.right
					})
				]
			}
		];
	} else {
		const childType = getChildNodeTypeName(queryAST);

		return [
			{
				conjunctionName: CONJUNCTIONS.includes(childType)
					? childType
					: AND,
				items: [
					...toCriteriaMap({
						lastNodeWasGroup: true,
						prevConjunction,
						queryAST: queryAST.value
					})
				]
			}
		];
	}
};

const isNotConjunction = nodeType =>
	!CONJUNCTIONS.includes(getTypeName(nodeType));

const getNextNonGroupNodeType = queryAST => {
	if (queryAST.value.type === 'BoolParentExpression') {
		return getNextNonGroupNodeType(query.value);
	} else {
		return queryAST.value.left
			? queryAST.value.left.type
			: queryAST.value.type;
	}
};

const operatorTransformation = ({queryAST}) => {
	return [
		{
			operatorName: oDataTransformationMap[queryAST.type].name,
			propertyName: queryAST.value.left.raw,
			value: queryAST.value.right.raw.replace(/['"]+/g, '')
		}
	];
};

const toCriteriaMap = ({
	lastNodeWasGroup = false,
	prevConjunction,
	queryAST
}) => {
	const oDataParserType = oDataTransformationMap[queryAST.type];

	return oDataParserType.transformationFunction({
		lastNodeWasGroup,
		prevConjunction,
		queryAST
	});
};

const getChildNodeTypeName = query =>
	oDataTransformationMap[query.value.type].name;
const getTypeName = type => oDataTransformationMap[type].name;

const translateToCriteria = query => {
	const queryAST = filter(query);

	return toCriteriaMap({queryAST})[0];
};

const buildQueryString = (queryItems, queryConjunction) => {
	let queryString = '';

	queryItems.forEach((item, index) => {
		const {
			conjunctionName,
			items,
			operatorName,
			propertyName,
			value
		} = item;

		if (index > 0) {
			queryString = queryString.concat(` ${queryConjunction} `);
		}

		if (conjunctionName) {
			queryString = queryString.concat(
				`(${buildQueryString(items, conjunctionName)})`
			);
		} else {
			if (RELATIONAL_OPERATORS.includes(operatorName)) {
				queryString = queryString.concat(
					`${propertyName} ${operatorName} '${value}'`
				);
			} else if (FUNCTIONAL_OPERATORS.includes(operatorName)) {
				queryString = queryString.concat(
					`${operatorName} (${propertyName}, '${value}')`
				);
			}
		}
	});

	return queryString;
};

const oDataTransformationMap = {
	AndExpression: {
		name: AND,
		transformationFunction: comparatorTransformation
	},
	BoolParenExpression: {
		name: GROUP,
		transformationFunction: groupTransformation
	},
	EqualsExpression: {
		name: EQ,
		transformationFunction: operatorTransformation
	},
	GreaterOrEqualsExpression: {
		name: GE,
		transformationFunction: operatorTransformation
	},
	GreaterThanExpression: {
		name: GT,
		transformationFunction: operatorTransformation
	},
	LesserOrEqualsExpression: {
		name: LE,
		transformationFunction: operatorTransformation
	},
	LesserThanExpression: {
		name: LT,
		transformationFunction: operatorTransformation
	},
	NotEqualsExpression: {
		name: NE,
		transformationFunction: operatorTransformation
	},
	OrExpression: {
		name: OR,
		transformationFunction: comparatorTransformation
	}
};

class ClayODataQueryBuilder extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			criteriaMap: translateToCriteria(props.query),
			initialQuery: props.query,
			query: props.query
		};
	}

	_updateQuery = newCriteriaMap => {
		this.setState({
			criteriaMap: newCriteriaMap,
			query: buildQueryString([newCriteriaMap])
		});
	};

	render() {
		const {maxNesting, properties, readOnly} = this.props;

		const {criteriaMap} = this.state;

		return (
			<div>
				<ClayCriteriaBuilder
					conjunctions={conjunctions}
					criteria={criteriaMap}
					maxNesting={maxNesting}
					onChange={this._updateQuery}
					operators={operators}
					properties={properties}
					readOnly={readOnly}
				/>

				<span>{buildQueryString([criteriaMap])}</span>
			</div>
		);
	}
}

ClayODataQueryBuilder.propTypes = {
	maxNesting: PropTypes.number,
	operators: PropTypes.array,
	properties: PropTypes.array,
	query: PropTypes.string,
	readOnly: PropTypes.bool
};

export default ClayODataQueryBuilder;