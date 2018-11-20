import React from 'react';
import {PropTypes} from 'prop-types';
import ClayCriteriaGroup from './ClayCriteriaGroup';

class ClayCriteriaRow extends React.Component {
	_getSelectedItem(list, idSelected) {
		return list.find(item => item.name === idSelected);
	}

	_handleInputChange = propertyName => event => {
		this._updateCriteria({[propertyName]: event.target.value});
	};

	_updateCriteria = newCriteria => {
		const {onChange, index, criterion} = this.props;

		onChange(index, Object.assign(criterion, newCriteria));
	};

	_handleToggleEdit = () => {
		this.setState({
			editing: !this.state.editing
		});
	};

	_handleDelete = () => {
		const {onChange, index} = this.props;
		onChange(index);
	};

	render() {
		const {
			criterion,
			editing,
			properties,
			criteriaTypes,
			operators,
			conjunctions,
			root
		} = this.props;

		const selectedProperty = this._getSelectedItem(
			properties,
			criterion.propertyName
		);

		const selectedOperator = this._getSelectedItem(
			operators,
			criterion.operatorName
		);

		const selectedOperator = this._getSelectedItem(operators, criterion.operatorName);

		if (root && !criterion.items) {
			criterion.items = this._createPlaceholderGroup(criterion);
		}

		return (
			<div className="container">
				{criterion.items ? (
					<ClayCriteriaGroup
						conjunctions={conjunctions}
						criteria={criterion}
						criteriaTypes={criteriaTypes}
						editing={editing}
						onChange={this._updateCriteria}
						operators={operators}
						properties={properties}
						spritemap={spritemap}
					/>
				) : (
					<div className={`query-row ${editing ? 'editing' : ''}`}>
						{editing ? (
							<div className="form-group-autofit">
								<div className="form-group-item">
									<select
										className="criteria"
										onChange={this._handleInputChange(
											'propertyName'
										)}
										value={
											selectedProperty &&
											selectedProperty.name
										}
									>
										{properties.map((property, index) => (
											<option
												key={index}
												value={property.name}
											>
												{property.label}
											</option>
										))}
									</select>
								</div>

								<div className="form-group-item">
									<select
										className="operator"
										onChange={this._handleInputChange(
											'operatorName'
										)}
										value={
											selectedOperator &&
											selectedOperator.name
										}
									>
										{operators.map((operator, index) => (
											<option
												key={index}
												value={operator.name}
											>
												{operator.label}
											</option>
										))}
									</select>
								</div>

								<div className="form-group-item">
									<input
										className="form-control"
										id="queryRowValue"
										onChange={this._handleInputChange(
											'value'
										)}
										type="text"
										value={criterion.value}
									/>
								</div>

								<div className="form-group-item form-group-item-shrink">
									<div className="btn-group-item">
										<button
											className="button btn-monospaced"
											onClick={this._handleDelete}
										>
											<span>Delete</span>
										</button>
									</div>
								</div>
							</div>
						) : (
							<div className="query-row-display">
								<div className="query">
									<span className="criteria">
										{selectedProperty.label}
									</span>

									<span className="operator">
										{selectedOperator.label}
									</span>

									<span className="value">
										{criterion.value}
									</span>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		)
	}
		
	_createPlaceholderGroup(criterion) {
		return [Object.assign({}, criterion)];
	}

	_getSelectedItem(list, idSelected) {
		return list.find(item => item.name === idSelected);
	}

	_handleInputChange = propertyName =>　event => {
		this._updateCriteria({[propertyName]: event.target.value});
	}

	_updateCriteria = newCriteria => {
		const {onChange, index, criterion} = this.props;

		onChange(
			index,
			Object.assign(criterion, newCriteria)
		);
	}
}

ClayCriteriaRow.propTypes = {
	conjunctions: PropTypes.array,
	criteriaTypes: PropTypes.object,
	criterion: PropTypes.object,
	editing: PropTypes.bool,
	index: PropTypes.number,
	operators: PropTypes.array,
	onChange: PropTypes.func,
	properties: PropTypes.array,
	spritemap: PropTypes.string
};

ClayCriteriaRow.defaultProps = {
	editing: true
};

export default ClayCriteriaRow;