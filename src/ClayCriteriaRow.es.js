import React from 'react';
import {PropTypes} from 'prop-types';
import ClayButton from './ClayButton.es';
import ClaySelect from './ClaySelect.es';
import {DropTarget as dropTarget} from 'react-dnd';
import {DragTypes} from './utils/drag-types';

class ClayCriteriaRow extends React.Component {
	render() {
		const {
			connectDropTarget,
			criterion,
			editing,
			hover,
			operators,
			properties
		} = this.props;

		const selectedProperty = this._getSelectedItem(
			properties,
			criterion.propertyName
		);

		const selectedOperator = this._getSelectedItem(
			operators,
			criterion.operatorName
		);

		return connectDropTarget(
			<div
				className={`criterion-row-root ${hover ? 'dnd-hover' : ''}`}
			>
				{editing ? (
					<div className="edit-container">
						<ClaySelect
							className="criterion-input form-control"
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
							selected={selectedProperty && selectedProperty.name}
						/>

						<ClaySelect
							className="criterion-input operator-input form-control"
							key="operator"
							onChange={this._handleInputChange(
								'operatorName'
							)}
							options={operators.map(
								({label, name}) => ({
									label,
									value: name
								})
							)}
							selected={selectedOperator && selectedOperator.name}
						/>

						<input
							className="criterion-input form-control"
							id="queryRowValue"
							key="value"
							onChange={this._handleInputChange('value')}
							type="text"
							value={criterion && criterion.value}
						/>

						<ClayButton
							className="btn-monospaced delete-button"
							iconName="trash"
							key="delete"
							onClick={this._handleDelete}
						/>
					</div>
				) : (
					<div className="read-only-container">
						<span className="criteria-string">
							{'Property '}
							<strong className="property-string">
								{`${selectedProperty && selectedProperty.label} `}
							</strong>

							{`${selectedOperator && selectedOperator.label} `}

							<strong className="value-string">
								{`${criterion && criterion.value}.`}
							</strong>
						</span>
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

	_handleDelete = event => {
		event.preventDefault();

		const {onChange} = this.props;

		onChange();
	}

	_updateCriteria = newCriteria => {
		const {criterion, onChange} = this.props;

		onChange(Object.assign(criterion, newCriteria));
	};
}

const DND_PROPS = {
	connectDropTarget: PropTypes.func,
	hover: PropTypes.bool
};

ClayCriteriaRow.propTypes = {
	...DND_PROPS,
	conjunctions: PropTypes.array,
	criteriaTypes: PropTypes.object,
	criterion: PropTypes.object,
	editing: PropTypes.bool,
	onChange: PropTypes.func,
	operators: PropTypes.array,
	properties: PropTypes.array,
	root: PropTypes.bool
};

ClayCriteriaRow.defaultProps = {
	editing: true,
	root: false
};

const dropZoneTarget = {
	drop(props, monitor) {
		const {criterion, onChange, operators} = props;

		const {name} = monitor.getItem();

		const newCriterion = {
			operatorName: operators[0].name,
			propertyName: name,
			value: ''
		};

		const newGroup = {
			conjunctionName: 'and',
			items: [criterion, newCriterion]
		};

		onChange(newGroup);
	}
};

export default dropTarget(
	DragTypes.PROPERTY,
	dropZoneTarget,
	(connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		hover: monitor.isOver()
	})
)(ClayCriteriaRow);