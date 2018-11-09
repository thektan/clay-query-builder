import Component from "metal-component";
import defineWebComponent from "metal-web-component";
import Soy from "metal-soy";
import { Config } from "metal-state";

import templates from "./ClayQueryBuilder.soy.js";

/**
 * A component used for building a query string.
 * Combines multiple queries together. A query has a
 * structure of criteria, operator, and value.
 */
class ClayQueryBuilder extends Component {
	created() {
		this.initialQuery = this.query;
	}

	_updateQuery(newQuery) {
		console.log("newQuery", newQuery);
		this.query = newQuery;
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

	rawQuery: Config.string(),

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
