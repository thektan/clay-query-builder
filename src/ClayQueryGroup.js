import Component from "metal-component";
import defineWebComponent from "metal-web-component";
import Soy from "metal-soy";
import { Config } from "metal-state";

import templates from "./ClayQueryGroup.soy.js";

class ClayQueryGroup extends Component {
	created() {
		this.conjunctionSelected = this.getConjunctionSelected(
			this.query.conjunctionId
		);
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
}

ClayQueryGroup.STATE = {
	conjunctions: Config.array(),
	conjunctionSelected: Config.object(),
	query: Config.object()
};

Soy.register(ClayQueryGroup, templates);

export { ClayQueryGroup };
export default ClayQueryGroup;
