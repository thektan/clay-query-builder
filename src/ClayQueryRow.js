import "clay-button";
import "clay-icon";
import "clay-select";
import Component from "metal-component";
import Soy from "metal-soy";
import { Config } from "metal-state";

import templates from "./ClayQueryRow.soy.js";

class ClayQueryRow extends Component {
	prepareStateForRender(states) {
		const {
			criteria,
			operators,
			queryItem: { criteriaId, operatorId }
		} = states;

		const newState = Object.assign(states, {
			criteria: this._formatWithSelected(criteria, criteriaId),
			operators: this._formatWithSelected(operators, operatorId)
		});

		return newState;
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
	_formatWithSelected(list, idSelected) {
		return list.map(item => {
			item.selected = item.value === idSelected;

			return item;
		});
	}

	_handleOperatorChange(event) {
		this.queryItem = Object.assign(this.queryItem, {
			operatorId: event.target.value
		});
	}

	_handleCriteriaChange(event) {
		this.queryItem = Object.assign(this.queryItem, {
			criteriaId: event.target.value
		});
	}

	_handleValueChange(event) {
		this.queryItem = Object.assign(this.queryItem, {
			value: event.target.value
		});
	}

	_updateQuery(newQuery) {
		this.updateQueryRow(
			this.index,
			Object.assign(this.queryItem, newQuery)
		);
	}

	_handleToggleEdit(event) {
		this.editing = !this.editing;
	}

	_handleSave(event) {
		this.updateQueryRow(this.index, this.queryItem);
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
