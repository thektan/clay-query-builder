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
		console.log("state", this.conjunctions);
	}

	addQuery() {
		console.log("state", this.conjunctions);
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

const CRITERION_SHAPE = {
	value: Config.string().required(),
	label: Config.string(),
	type: Config.string(),
	acceptedValues: Config.arrayOf(Config.shapeOf(CLAY_SELECT_ITEM_SHAPE))
};

ClayQueryBuilder.STATE = {
	/**
	 * A map of criteria that can be selected to create a query from.
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

	criteria: Config.object(Config.shapeOf(CRITERION_SHAPE)).required(),

	/**
	 * A map of conjunctions to combine multiple queries together.
	 *
	 * Example:
	 * {
	 * 	"AND": {
	 * 		label: "AND", // String displayed on the button
	 * 		value: "AND" // Value used for constructing the query
	 * 	}
	 * }
	 */

	conjunctions: Config.object(),

	/**
	 * Supported operators and the types they support. According to the
	 * criteria type, operators will be filtered to show only the supported ones.
	 *
	 * Example:
	 * {
	 * 	"eq": {
	 * 		label: "equals",
	 * 		value: "eq"
	 * 		supportedTypes": ["boolean", "date", "number", "string"]
	 * 	}
	 * }
	 */

	operators: Config.object(),

	/**
	 * Path to the spritemap svg for displaying the necessary icons throughout
	 * the component.
	 */

	spritemap: Config.string().required(),

	/**
	 * Structure of the query.
	 * @prop {array} childQueries Nested query groups with the same query
	 * 	structure as this property.
	 * @prop {object} criterion The criterion selected.
	 * @prop {string} operatorId The operator id selected.
	 * @prop {array} values The values selected.
	 */

	query: Config.arrayOf(
		Config.shapeOf({
			conjunctionId: Config.string(),
			criterionId: Config.string(),
			operatorId: Config.string(),
			values: Config.array(),
			childQueries: Config.array()
		})
	).value([]),
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
