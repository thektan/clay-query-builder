import React from 'react';
import {PropTypes} from 'prop-types';
import ClayCriteriaGroup from './ClayCriteriaGroup';
import ClayButton from './ClayButton';

class ClayCriteriaRow extends React.Component {
	render() {
		const {
			criterion,
			editing,
			properties,
			criteriaTypes,
			operators,
			conjunctions,
			spritemap
		} = this.props;

		const selectedProperty = this._getSelectedItem(
			properties,
			criterion.propertyName
		);

		const selectedOperator = this._getSelectedItem(
			operators,
			criterion.operatorName
		);

		return (
			<div className="container">
				{criterion.items ? (
					<ClayCriteriaGroup
						properties={properties}
						editing={editing}
						criteriaTypes={criteriaTypes}
						conjunctions={conjunctions}
						onChange={this._updateCriteria}
						operators={operators}
						criteria={criterion}
						spritemap={spritemap}
					/>
				) : (
					<div className={`query-row ${editing ? 'editing' : ''}`}>
						{editing ? (
							<div className="form-group-autofit">
								<div className="form-group-item">
									<select
										className="criteria"
										value={selectedProperty.name}
										onChange={this._handleInputChange(
											'propertyName'
										)}
									>
										{properties.map((property, index) => (
											<option
												value={property.name}
												key={index}
											>
												{property.label}
											</option>
										))}
									</select>
								</div>

								<div className="form-group-item">
									<select
										className="operator"
										value={selectedOperator.name}
										onChange={this._handleInputChange(
											'operatorName'
										)}
									>
										{operators.map((operator, index) => (
											<option
												value={operator.name}
												key={index}
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
										value={criterion.value}
										onChange={this._handleInputChange(
											'value'
										)}
										type="text"
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
		);
	}

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
}

ClayCriteriaRow.propTypes = {
	criterion: PropTypes.object,
	editing: PropTypes.bool,
	properties: PropTypes.array,
	criteriaTypes: PropTypes.object,
	operators: PropTypes.array,
	onChange: PropTypes.func,
	index: PropTypes.number
};

ClayCriteriaRow.defaultProps = {
	editing: true
};

export default ClayCriteriaRow;