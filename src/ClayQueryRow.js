import "clay-button";
import "clay-icon";
import "clay-select";
import Component from "metal-component";
import Soy from "metal-soy";
import { Config } from "metal-state";

import templates from "./ClayQueryRow.soy.js";

class ClayQueryRow extends Component {
	created() {
		const { criteria, criteriaId, operatorId, operators } = this;

		this.criteria = this.formatWithSelected(criteria, criteriaId);
		this.operators = this.formatWithSelected(operators, operatorId);
	}

	/**
	 * Adds a `selected` property for pre-selecting an item on the select
	 * component.
	 *
	 * @param {array} list
	 * @param {string} idSelected
	 * @returns List of items formatted for the options property on a select
	 * input.
	 */
	formatWithSelected(list, idSelected) {
		return list.map(item => {
			item.selected = item.value === idSelected;

			return item;
		});
	}
}

ClayQueryRow.STATE = {
	criteria: Config.array(),
	criteriaId: Config.string(),
	operatorId: Config.string(),
	operators: Config.array(),
	editing: Config.bool().value(false)
};

Soy.register(ClayQueryRow, templates);

export { ClayQueryRow };
export default ClayQueryRow;
