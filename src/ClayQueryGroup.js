import Component from "metal-component";
import defineWebComponent from "metal-web-component";
import Soy from "metal-soy";
import { Config } from "metal-state";

import templates from "./ClayQueryGroup.soy.js";

const ID_PREFIX = "group_";

var groupId = 0;

/**
 * Generate a unique id for the group.
 *
 * @returns the unique group id.
 */
function generateId() {
	return ID_PREFIX + groupId++;
}

class ClayQueryGroup extends Component {
	created() {
		this._handleConjunctionClick = this._handleConjunctionClick.bind(this);

		this.groupId = generateId();

		console.log("group created", this.groupId);
	}

	/**
	 * Gets the conjunction object containing a label and value from the
	 * selected id.
	 *
	 * @param {string} conjunctionId
	 * @returns Conjunction object
	 * @memberof ClayQueryGroup
	 */
	_getConjunctionName(conjunctionId) {
		return this.conjunctions.find(({ value }) => value === conjunctionId)
			.label;
	}

	prepareStateForRender(states) {
		const newState = Object.assign(states, {
			selectedConjunctionName: this._getConjunctionName(
				states.query.conjunctionId
			)
		});

		return newState;
	}

	/**
	 * Cycles through conjunctions.
	 *
	 * @param {!Event} event
	 * @private
	 */
	_handleConjunctionClick(event) {
		const { conjunctions, query } = this;

		const index = conjunctions.findIndex(
			item => item.value === query.conjunctionId
		);

		const conjunctionSelected =
			index === conjunctions.length - 1
				? conjunctions[0].value
				: conjunctions[index + 1].value;

		this.updateQuery(
			Object.assign(this.query, {
				conjunctionId: conjunctionSelected
			})
		);
	}

	_updateQueryRow(index, newQueryItems) {
		this.updateQuery(
			Object.assign(this.query, {
				items: Object.assign(this.query.items, {
					[index]: newQueryItems
				})
			})
		);
	}
}

ClayQueryGroup.STATE = {
	/**
	 * Unique id of the group used for identifying item groups.
	 */
	groupId: Config.string(),
	conjunctions: Config.array(),
	selectedConjunctionName: Config.string(),
	query: Config.object(),
	updateQuery: Config.func()
};

Soy.register(ClayQueryGroup, templates);

export { ClayQueryGroup };
export default ClayQueryGroup;
