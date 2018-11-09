import Component from "metal-component";
import defineWebComponent from "metal-web-component";
import { EventHandler } from "metal-events";
import Soy from "metal-soy";
import { Config } from "metal-state";

import templates from "./ClayQueryGroup.soy.js";

class ClayQueryGroup extends Component {
	created() {
		this.conjunctionSelected = this.getConjunctionSelected(
			this.query.conjunctionId
		);

		this._handleConjunctionClick = this._handleConjunctionClick.bind(this);
	}

	/**
	 * Gets the conjunction object containing a label and value from the
	 * selected id.
	 *
	 * @param {string} conjunctionId
	 * @returns Conjunction object
	 * @memberof ClayQueryGroup
	 */
	getConjunctionSelected(conjunctionId) {
		return this.conjunctions.find(({ value }) => value === conjunctionId);
	}

	/**
	 * Cycles through conjunctions.
	 *
	 * @param {!Event} event
	 * @private
	 */
	_handleConjunctionClick(event) {
		const { conjunctions, conjunctionSelected } = this;

		const index = conjunctions.findIndex(
			item => item.value === conjunctionSelected.value
		);

		this.conjunctionSelected =
			index === conjunctions.length - 1
				? conjunctions[0]
				: conjunctions[index + 1];
	}
}

ClayQueryGroup.STATE = {
	conjunctions: Config.array(),
	conjunctionSelected: Config.object(),
	query: Config.object()
};

Soy.register(ClayQueryGroup, templates);

export { ClayQueryGroup };
export default ClayQueryGroup;
