import React from 'react';
import {PropTypes} from 'prop-types';
import ClayCriteriaGroup from './ClayCriteriaGroup';
import ClayButton from './ClayButton';
import ClaySelect from './ClaySelect';
import './css/ClayCriteriaRow.scss';

class ClayCriteriaRow extends React.Component {
	render() {
		const {
			conjunctions,
			criteriaTypes,
			criterion,
			editing,
			operators,
			properties,
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

		if (root && !criterion.items) {
			criterion.items = this._createPlaceholderGroup(criterion);
		}

		return (
			<div styleName="criterion-container">
				{criterion.items ? (
					<ClayCriteriaGroup
						conjunctions={conjunctions}
						criteria={criterion}
						criteriaTypes={criteriaTypes}
						editing={editing}
						onChange={this._updateCriteria}
						operators={operators}
						properties={properties}
					/>
				) : (
					<div
						styleName={`criterion-row ${editing ? 'editing' : ''}`}
					>
						{editing ? (
							<div styleName="edit-container">
								<ClaySelect
									className="form-control"
									key="property"
									onChange={this._handleInputChange(
										'propertyName'
									)}
									options={properties.map(
										({label, name}) => ({
											label,
											value: name
										})
									)}
									selected={selectedProperty.name}
									styleName="criterion-input"
								/>

								<ClaySelect
									className="form-control"
									key="operator"
									onChange={this._handleInputChange(
										'operatorName'
									)}
									options={operators.map(
										({label, name}) => ({
											label,
											value: name
										}))
									}
									selected={selectedOperator.name}
									styleName="criterion-input operator-input"
								/>

								<input
									className="form-control"
									id="queryRowValue"
									key="value"
									onChange={this._handleInputChange('value')}
									styleName="criterion-input"
									type="text"
									value={criterion.value}
								/>

								<ClayButton
									className="btn-monospaced"
									iconName="trash"
									key="delete"
									onClick={this._handleDelete}
									styleName="delete-button"
								/>
							</div>
						) : (
							<div styleName="read-only-container">
								<span styleName="criteria-string">
									{'Property '}
									<strong styleName="property-string">
										{`${selectedProperty.label} `}
									</strong>

									{`${selectedOperator.label} `}

									<strong styleName="value-string">
										{`${criterion.value}.`}
									</strong>
								</span>
							</div>
						)}
					</div>
				)}
			</div>
		);
	}

	_createPlaceholderGroup(criterion) {
		return [Object.assign({}, criterion)];
	}

	_getSelectedItem(list, idSelected) {
		return list.find(item => item.name === idSelected);
	}

	_handleInputChange = propertyName => event => {
		this._updateCriteria({[propertyName]: event.target.value});
	};

	_updateCriteria = newCriteria => {
		const {criterion, index, onChange} = this.props;

		onChange(index, Object.assign(criterion, newCriteria));
	};
}

ClayCriteriaRow.propTypes = {
	conjunctions: PropTypes.array,
	criteriaTypes: PropTypes.object,
	criterion: PropTypes.object,
	editing: PropTypes.bool,
	index: PropTypes.number,
	onChange: PropTypes.func,
	operators: PropTypes.array,
	properties: PropTypes.array,
	root: PropTypes.bool
};

ClayCriteriaRow.defaultProps = {
	editing: true,
	root: false
};

export default ClayCriteriaRow;