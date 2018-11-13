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
			criteriaTypes,
			operators,
			queryItem: { criteriaId, operatorId }
		} = states;

		const criterion = this._getSelectedItem(criteria, criteriaId);

		const newState = Object.assign(states, {
			criteria: this._formatWithSelected(criteria, criteriaId),
			operators: this._formatWithSelected(
				criterion ? criteriaTypes[criterion.type] : operators,
				operatorId
			),
			criterion,
			operator: this._getSelectedItem(operators, operatorId)
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

	_getSelectedItem(list, idSelected) {
		return list.find(item => item.value === idSelected);
	}

	_handleInputChange(event, propertyName) {
		this.queryItem = Object.assign(this.queryItem, {
			[propertyName]: event.target.value
		});
	}

	_handleOperatorChange(event) {
		this._handleInputChange(event, "operatorId");
	}

	_handleCriteriaChange(event) {
		this._handleInputChange(event, "criteriaId");
	}

	_handleValueChange(event) {
		this._handleInputChange(event, "value");
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

	_handleDelete(event) {
		this.updateQueryRow(this.index);
	}
}

ClayQueryRow.STATE = {
	queryItem: Config.object(),
	criteria: Config.array(),
	criteriaTypes: Config.object(),
	criterion: Config.object(),
	operator: Config.object(),
	operators: Config.array(),
	updateQueryRow: Config.func(),
	index: Config.number(),
	editing: Config.bool().value(false)
};

Soy.register(ClayQueryRow, templates);

export { ClayQueryRow };
export default ClayQueryRow;
