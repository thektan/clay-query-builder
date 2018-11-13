import Component from "metal-component";
import defineWebComponent from "metal-web-component";
import Soy from "metal-soy";
import { EventHandler } from "metal-events";
import { Config } from "metal-state";

import "./css/main.scss";

import templates from "./ClayQueryBuilder.soy.js";

const RELATIONAL_OPERATORS = ["eq", "ne", "gt", "ge", "lt", "le"];
const STRING_OPERATORS = [
	"contains",
	"not contains",
	"endswith",
	"not endswith",
	"startswith",
	"not startswith"
];

/**
 * A component used for building a query string.
 * Combines multiple queries together. A query has a
 * structure of criteria, operator, and value.
 */
class ClayQueryBuilder extends Component {
	created() {
		this.initialQuery = this.query;

		this.queryString = this.getQueryString();

		this.criteriaTypes = this._buildCriteriaTypes();
	}

	/**
	 * Builds a map of criteria types and their supported operators.
	 *
	 * @returns Map of criteria types.
	 */
	_buildCriteriaTypes() {
		const { operators } = this;

		return operators.reduce((criteriaTypes, { supportedTypes }) => {
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
			.filter(({ items }) => (items ? items.length : true))
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
	_updateQuery(newQuery) {
		this.query = this._cleanUpQuery([newQuery]).pop();

		this.queryString = this.getQueryString();

		console.log("query", this.query);
		console.log("queryString", this.queryString);
	}

	/**
	 * Converts a query object into an OData query string.
	 *
	 * @param {string} query
	 * @return {string} The query string.
	 */
	getQueryString() {
		return this.buildQueryString([this.query]);
	}

	buildQueryString(queryItems, queryConjunction) {
		let queryString = "";

		queryItems.forEach((item, index) => {
			const {
				items,
				conjunctionId,
				criteriaId,
				operatorId,
				value
			} = item;

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
	label: Config.string().required(),
	selected: Config.bool(),
	value: Config.string().required()
};

const QUERY_GROUP_SHAPE = {
	conjunctionId: Config.string(),
	items: Config.array()
};

const QUERY_ITEM_SHAPE = {
	criteriaId: Config.string(),
	operatorId: Config.string(),
	value: Config.oneOfType([Config.string(), Config.array()])
};

ClayQueryBuilder.STATE = {
	/**
	 * A list of criteria that can be selected to create a query from.
	 *
	 * @prop {string} value Used when translating the criteria into a
	 * 	query string.
	 * @prop {string} label Displayed for selecting the criteria. Defaults to
	 * 	value prop.
	 * @prop {string} type The type of criteria (i.e. "string|number") that will
	 * 	determine the operations available.
	 * @prop {array} acceptedValues Will convert the value input into a select
	 * 	input regardless of the "type" prop.
	 */

	criteria: Config.arrayOf(
		Config.shapeOf({
			value: Config.string().required(),
			label: Config.string(),
			type: Config.string(),
			acceptedValues: Config.arrayOf(
				Config.shapeOf(CLAY_SELECT_ITEM_SHAPE)
			)
		})
	).required(),

	/**
	 * A map of conjunctions to combine multiple queries together.
	 * Example: [{label: 'AND', value: 'AND'}]
	 */

	conjunctions: Config.arrayOf(
		Config.shapeOf({
			label: Config.string(),
			value: Config.string()
		})
	),

	/**
	 * A map of criteria types and their supported operators. Generated from
	 * the operators list.
	 */
	criteriaTypes: Config.object(),

	/**
	 * Used for restoring the initial query.
	 */
	initialQuery: Config.shapeOf({
		conjunctionId: Config.string(),
		items: Config.arrayOf(
			Config.oneOfType([
				Config.shapeOf(QUERY_GROUP_SHAPE),
				Config.shapeOf(QUERY_ITEM_SHAPE)
			])
		)
	}),

	/**
	 * Supported operators and the types they support. According to the
	 * criteria type, operators will be filtered to show only the supported
	 * ones. The supported types should match the type property on criteria.
	 *
	 * Example:
	 * [{
	 * 		label: "equals",
	 * 		value: "eq"
	 * 		supportedTypes": ["boolean", "date", "number", "string"]
	 * }]
	 */

	operators: Config.arrayOf(
		Config.shapeOf({
			label: Config.string(),
			supportedTypes: Config.arrayOf(Config.string()),
			value: Config.string()
		})
	),

	/**
	 * Path to the spritemap svg for displaying the necessary icons throughout
	 * the component.
	 */

	spritemap: Config.string().required(),

	/**
	 * Structure of the query.
	 */

	query: Config.shapeOf({
		conjunctionId: Config.string(),
		items: Config.arrayOf(
			Config.oneOfType([
				Config.shapeOf(QUERY_GROUP_SHAPE),
				Config.shapeOf(QUERY_ITEM_SHAPE)
			])
		)
	}),

	/**
	 * Query string to save into a form field.
	 */
	queryString: Config.string(),

	/**
	 * @TODO Document and implement these props
	 */
	maxNesting: Config.number(),
	readOnly: Config.bool().value(false)
};

defineWebComponent("clay-query-builder", ClayQueryBuilder);

Soy.register(ClayQueryBuilder, templates);

export { ClayQueryBuilder };
export default ClayQueryBuilder;
