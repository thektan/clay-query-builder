import React from 'react';
import {PropTypes} from 'prop-types';
import ClayCriteriaGroup from './ClayCriteriaGroup';
<<<<<<< HEAD
=======
import ClayButton from './ClayButton';
import ClaySelect from './ClaySelect';
import './ClayCriteriaRow.scss';
>>>>>>> LPS-85743 Styling

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
			<div styleName="criterion-container">
				{criterion.items ? (
					<ClayCriteriaGroup
						conjunctions={conjunctions}
						criteria={criterion}
						criteriaTypes={criteriaTypes}
						editing={editing}
						onChange={this._updateCriteria}
						operators={operators}
						criteria={criterion}
					/>
				) : (
					<div styleName={`criterion-row ${editing ? 'editing': ''}`}>
						{editing ? (
							<div styleName='edit-container'>
								<ClaySelect 
									options={properties.map(({name, label}) => ({value: name, label}))} 
									selected={selectedProperty.name} 
									className='form-control'
									styleName='criterion-input'
									onChange={this._handleInputChange('propertyName')}
									key="property"
								/>

								<ClaySelect 
									options={operators.map(({name, label}) => ({value: name, label}))} 
									selected={selectedOperator.name} 
									className='form-control'
									styleName='criterion-input operator-input'
									onChange={this._handleInputChange('operatorName')}
									key="operator"
								/>

								<input className="form-control" styleName='criterion-input' id="queryRowValue" key="value" value={criterion.value} onChange={this._handleInputChange('value')} type="text"/>

								<ClayButton
									className='btn-monospaced'
									styleName='delete-button'
									onClick={this._handleDelete}
									iconName='trash'
									key="delete"
								/>
							</div>
						) : (
							<div styleName="read-only-container">
								<span styleName="criteria-string">
									{`Property `}
									<strong styleName='property-string'>{`${selectedProperty.label} `}</strong>
									{`${selectedOperator.label} `}
									<strong styleName='value-string'>{`${criterion.value}.`}</strong>
								</span>
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
	index: PropTypes.number,
	root: PropTypes.bool
};

ClayCriteriaRow.defaultProps = {
	editing: true,
	root: false
}

export default ClayCriteriaRow;