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

const comparatorTransformation = (query, transformFromAST, prevType) => {
	if (prevType === query.type) {
		return [
			...transformFromAST(query.value.left, query.type),
			...transformFromAST(query.value.right, query.type)
		];
	} else {
		return [
			{
				conjunctionName: oDataTransformationMap[query.type].name,
				items: [
					...transformFromAST(query.value.left, query.type),
					...transformFromAST(query.value.right, query.type)
				]
			}
		];
	}
};

const groupTransformation = (query, transform) => transform(query.value);

const operatorTransformation = query => {
	return [
		{
			operatorName: oDataTransformationMap[query.type].name,
			propertyName: query.value.left.raw,
			value: query.value.right.raw
		}
	];
};

const toCriteriaMap = (queryAST, prevType) => {
	return oDataTransformationMap[queryAST.type].transformationFunction(
		queryAST,
		toCriteriaMap,
		prevType
	);
};

const translateToCriteria = query => {
	const queryAST = filter(query);

	return toCriteriaMap(queryAST)[0];
};

const buildQueryString = (queryItems, queryConjunction) => {
	let queryString = '';

	queryItems.forEach((item, index) => {
		const {
			items,
			conjunctionName,
			propertyName,
			operatorName,
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
					`(${propertyName} ${operatorName} "${value}")`
				);
			} else if (FUNCTIONAL_OPERATORS.includes(operatorName)) {
				queryString = queryString.concat(
					`(${operatorName} (${propertyName}, "${value}"))`
				);
			}
		}
	});

	return queryString;
};

const oDataTransformationMap = {
	BoolParenExpression: {
		transformationFunction: groupTransformation,
		name: GROUP
	},
	OrExpression: {
		transformationFunction: comparatorTransformation,
		name: OR
	},
	AndExpression: {
		transformationFunction: comparatorTransformation,
		name: AND
	},
	GreaterOrEqualsExpression: {
		transformationFunction: operatorTransformation,
		name: GE
	},
	GreaterThanExpression: {
		transformationFunction: operatorTransformation,
		name: GT
	},
	LesserOrEqualsExpression: {
		transformationFunction: operatorTransformation,
		name: LE
	},
	LesserThanExpression: {
		transformationFunction: operatorTransformation,
		name: LT
	},
	EqualsExpression: {
		transformationFunction: operatorTransformation,
		name: EQ
	}
};

class ClayODataQueryBuilder extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			initialQuery: props.query,
			query: props.query,
			criteriaMap: translateToCriteria(props.query)
		};
	}

	_updateQuery = newCriteriaMap => {
		this.setState({
			criteriaMap: newCriteriaMap,
			query: buildQueryString([newCriteriaMap])
		});
	};

	render() {
		const {properties, maxNesting, readOnly} = this.props;

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
	readOnly: PropTypes.bool,
	properties: PropTypes.array,
	query: PropTypes.string
};

export default ClayODataQueryBuilder;