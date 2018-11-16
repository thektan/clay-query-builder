import React from 'react';
import {PropTypes} from 'prop-types';
import ClayQueryGroup from './ClayQueryGroup';

class ClayQueryRow extends React.Component {
	constructor() {
		super();

		this.state = {editing: true};
	}
	render() {
		const {
			queryItem,
			criteria,
			criteriaTypes,
			operators,
			conjunctions,
			spritemap,
			query
		} = this.props;

		const {
			editing
		} = this.state;

		const selectedCriterion = this._getSelectedItem(criteria, queryItem.criteriaId);

		const selectedOperator = this._getSelectedItem(operators, queryItem.operatorId)
		
		return (
			<div className="container">
				{queryItem.items ? (
					<ClayQueryGroup
						criteria={criteria}
						criteriaTypes={criteriaTypes}
						conjunctions={conjunctions}
						updateQuery={this._updateQuery}
						operators={operators}
						query={queryItem}
						spritemap={spritemap}
					/>
				) : (
					<div className={`query-row ${editing ? 'editing': ''}`}>
						{editing ? (
							<div className="form-group-autofit">
								<div className="form-group-item">
									<select className="criteria" value={selectedCriterion.value} onChange={this._handleInputChange('criteriaId')}>
										{criteria.map((criterion, index) => (
											<option value={criterion.value} key={index}>{criterion.label}</option>
										))}
									</select>
								</div>

								<div className="form-group-item">
									<select className="operator" value={selectedOperator.value} onChange={this._handleInputChange('operatorId')}>
										{operators.map((operator, index) => (
											<option value={operator.value} key={index}>{operator.label}</option>
										))}
									</select>
								</div>

								<div className="form-group-item">
									<input className="form-control" id="queryRowValue" value={queryItem.value} onChange={this._handleInputChange('value')} type="text"/>
								</div>

								<div className="form-group-item form-group-item-shrink">
									<div className="btn-group">
										<div className="btn-group-item">
											<button className="button btn-monospaced" onClick={this._handleSave}>
												<span>Save</span>
											</button>
										</div>

										<div className="btn-group-item">
											<button className="button btn-monospaced" onClick={this._handleToggleEdit}>
												<span>Edit</span>
											</button>
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className="query-row-display">
								<div className="query">
									<span className="criteria">{selectedCriterion.label}</span>

									<span className="operator">{selectedOperator.label}</span>

									<span className="value">{queryItem.value}</span>
								</div>

								<div className="actions">
									<div className="btn-group">
										<div className="btn-group-item">
											<button className="button btn-monospaced" onClick={this._handleToggleEdit}>
												<span>Edit</span>
											</button>
										</div>

										<div className="btn-group-item">
											<button className="button btn-monospaced" onClick={this._handleDelete}>
												<span>Delete</span>
											</button>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		)
		
	}

	// /**
	//  * Adds a `selected` property for pre-selecting an item on the select
	//  * component.
	//  *
	//  * @param {array} list
	//  * @param {string} idSelected
	//  * @return {array} List of items formatted for the options property on a select
	//  * input.
	//  */
	// _formatWithSelected(list, idSelected) {
	// 	return list.map(item => {
	// 		item.selected = item.value === idSelected;

	// 		return item;
	// 	});
	// }

	_getSelectedItem(list, idSelected) {
		return list.find(item => item.value === idSelected);
	}

	_handleInputChange = propertyName =>　event => {
		this._updateQuery({[propertyName]: event.target.value});
	}

	_updateQuery = newQuery => {
		const {updateQueryRow, index, queryItem} = this.props;

		updateQueryRow(
			index,
			Object.assign(queryItem, newQuery)
		);
	}

	_handleToggleEdit = () => {
		this.setState({
			editing: !this.state.editing
		});
	}

	_handleSave = () => {
		const {updateQueryRow, index, queryItem} = this.props;

		updateQueryRow(index, queryItem);
	}

	_handleDelete = () => {
		const {updateQueryRow, index} = this.props;
		updateQueryRow(index);
	}
}

ClayQueryRow.propTypes = {
	queryItem: PropTypes.object,
	criteria: PropTypes.array,
	criteriaTypes: PropTypes.object,
	criterion: PropTypes.object,
	operator: PropTypes.object,
	operators: PropTypes.array,
	updateQueryRow: PropTypes.func,
	index: PropTypes.number,
};

export default ClayQueryRow;