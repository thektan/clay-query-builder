import React from 'react';
import PropTypes from 'prop-types';
import ClayQueryGroup from './ClayQueryGroup';

const RELATIONAL_OPERATORS = ['eq', 'ne', 'gt', 'ge', 'lt', 'le'];
const STRING_OPERATORS = [
	'contains',
	'not contains',
	'endswith',
	'not endswith',
	'startswith',
	'not startswith'
];

/**
 * A component used for building a query string.
 * Combines multiple queries together. A query has a
 * structure of criteria, operator, and value.
 */
class ClayQueryBuilder extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			initialQuery: this.props.query
		};
	}

	render() {
		const {
			criteria,
			conjunctions,
			operators,
			query,
			spritemap
		} = this.props;

		const {
			initialQuery,
			queryString
		} = this.state;

	
		return (
			<div className="query-builder-root">
				<ClayQueryGroup 
					criteria={criteria}
					criteriaTypes={ClayQueryBuilder._buildCriteriaTypes(operators)}
					conjunctions={conjunctions}
					operators={operators}
					updateQuery={this._updateQuery}
					query={query}
					spritemap={spritemap}
				/>

				<span className="query-string">
					{ClayQueryBuilder._getQueryString(query)}
				</span>
			</div>
		);
	}

	/**
	 * Builds a map of criteria types and their supported operators.
	 *
	 * @returns Map of criteria types.
	 */
	static _buildCriteriaTypes(operators) {
		return operators.reduce((criteriaTypes, {supportedTypes}) => {
			supportedTypes.forEach(type => {
				if (!criteriaTypes[type]) {
					criteriaTypes[type] = operators.filter(operator =>
						operator.supportedTypes.includes(type)
					);
				}
			});

			return criteriaTypes;
		}, new Map());
	}

	/**
	 * Cleans up the query state by removing any groups with no items.
	 *
	 * @param {array} queryItems The query to clean up.
	 * @returns {object} The cleaned up query.
	 */
	_cleanUpQuery(queryItems) {
		const test = queryItems
			.filter(({items}) => (items ? items.length : true))
			.map(item =>
				item.items
					? Object.assign(item, {
						items: this._cleanUpQuery(item.items)
					  })
					: item
			);

		return test;
	}

	/**
	 * Updates the query state from changes made by the group and row
	 * components.
	 *
	 * @param {object} newQuery
	 */
	_updateQuery = newQuery => {
		this.setState({
			query: this._cleanUpQuery([newQuery]).pop()
		});
	}

	/**
	 * Converts a query object into an OData query string.
	 *
	 * @param {string} query
	 * @return {string} The query string.
	 */
	static _getQueryString(query) {
		return ClayQueryBuilder.buildQueryString([query]);
	}

	static buildQueryString(queryItems, queryConjunction) {
		let queryString = '';

		queryItems.forEach((item, index) => {
			const {items, conjunctionId, criteriaId, operatorId, value} = item;

			if (index > 0) {
				queryString = queryString.concat(` ${queryConjunction} `);
			}

			if (conjunctionId) {
				queryString = queryString.concat(
					`(${this.buildQueryString(items, conjunctionId)})`
				);
			} else {
				if (RELATIONAL_OPERATORS.includes(operatorId)) {
					queryString = queryString.concat(
						`(${criteriaId} ${operatorId} "${value}")`
					);
				} else if (STRING_OPERATORS.includes(operatorId)) {
					queryString = queryString.concat(
						`(${operatorId} (${criteriaId}, "${value}"))`
					);
				}
			}
		});

		return queryString;
	}
}

/**
 * Options to be inserted into a clay select input.
 * Same definitions from https://github.com/liferay/clay/blob/master/packages/clay-select/src/ClaySelect.js#L93-L97
 */
const CLAY_SELECT_ITEM_SHAPE = {
	label: PropTypes.string.isRequired,
	selected: PropTypes.bool,
	value: PropTypes.string.isRequired
};

const QUERY_GROUP_SHAPE = {
	conjunctionId: PropTypes.string,
	items: PropTypes.array
};

const QUERY_ITEM_SHAPE = {
	criteriaId: PropTypes.string,
	operatorId: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

ClayQueryBuilder.propTypes = {
	criteria: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.string.isRequired,
			label: PropTypes.string,
			type: PropTypes.string,
			acceptedValues: PropTypes.arrayOf(
				PropTypes.shape(CLAY_SELECT_ITEM_SHAPE)
			)
		})
	).isRequired,
	conjunctions: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.string
		})
	),
	operators: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			supportedTypes: PropTypes.arrayOf(PropTypes.string),
			value: PropTypes.string
		})
	),
	spritemap: PropTypes.string.isRequired,
	query: PropTypes.shape({
		conjunctionId: PropTypes.string,
		id: PropTypes.string,
		items: PropTypes.arrayOf(
			PropTypes.oneOfType([
				PropTypes.shape(QUERY_GROUP_SHAPE),
				PropTypes.shape(QUERY_ITEM_SHAPE)
			])
		)
	}),
	maxNesting: PropTypes.number,
	readOnly: PropTypes.bool
};

ClayQueryBuilder.defaultProps = {
	readOnly: false
};

export default ClayQueryBuilder;