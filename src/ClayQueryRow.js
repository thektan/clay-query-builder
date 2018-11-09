import "clay-button";
import "clay-icon";
import "clay-select";
import Component from "metal-component";
import Soy from "metal-soy";
import { Config } from "metal-state";

import templates from "./ClayQueryRow.soy.js";

class ClayQueryRow extends Component {
	created() {
		const { criteria, operators } = this;
		const { criteriaId, operatorId } = this.queryItem;

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

	_handleOperatorSelect(event) {
		this.updateQueryRow(
			this.index,
			Object.assign(this.queryItem, {
				operatorId: event.target.value
			})
		);
	}

	_handleCriteriaSelect(event) {
		this.updateQueryRow(
			this.index,
			Object.assign(this.queryItem, {
				criteriaId: event.target.value
			})
		);
	}

	_updateQuery(newQuery) {
		this.updateQueryRow(
			this.index,
			Object.assign(this.queryItem, newQuery)
		);
	}
}

ClayQueryRow.STATE = {
	queryItem: Config.object(),
	criteria: Config.array(),
	operators: Config.array(),
	updateQueryRow: Config.func(),
	index: Config.number(),
	editing: Config.bool().value(false)
};

Soy.register(ClayQueryRow, templates);

export { ClayQueryRow };
export default ClayQueryRow;
