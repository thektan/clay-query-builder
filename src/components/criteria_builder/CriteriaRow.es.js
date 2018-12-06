import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import ClayButton from '../shared/ClayButton.es';
import ClaySelect from '../shared/ClaySelect.es';
import {CONJUNCTIONS} from '../../utils/constants.es';
import {DropTarget as dropTarget} from 'react-dnd';
import {DragTypes} from '../../utils/drag-types.es';
import getCN from 'classnames';

import {Liferay} from '../../utils/language';

class CriteriaRow extends Component {
	static propTypes = {
		connectDropTarget: PropTypes.func,
		criterion: PropTypes.object,
		editing: PropTypes.bool,
		hover: PropTypes.bool,
		onChange: PropTypes.func,
		supportedConjunctions: PropTypes.array,
		supportedOperators: PropTypes.array,
		supportedProperties: PropTypes.array,
		supportedPropertyTypes: PropTypes.object
	};

	static defaultProps = {
		editing: true,
	};

	_getSelectedItem = (list, idSelected) =>
		list.find(item => item.name === idSelected);

	_handleInputChange = propertyName => event => {
		this._updateCriteria({[propertyName]: event.target.value});
	};

	_handleDelete = event => {
		event.preventDefault();

		this.props.onChange();
	}

	_updateCriteria = newCriteria => {
		const {criterion, onChange} = this.props;

		onChange(Object.assign(criterion, newCriteria));
	};

	render() {
		const {
			connectDropTarget,
			criterion,
			editing,
			hover,
			supportedOperators,
			supportedProperties
		} = this.props;

		const selectedProperty = this._getSelectedItem(
			supportedProperties,
			criterion.propertyName
		);

		const selectedOperator = this._getSelectedItem(
			supportedOperators,
			criterion.operatorName
		);

		const classes = getCN(
			'criterion-row-root',
			{
				'dnd-hover': hover
			}
		);

		return connectDropTarget(
			<div
				className={classes}
			>
				{editing ? (
					<div className="edit-container">
						<ClaySelect
							className="criterion-input form-control"
							onChange={this._handleInputChange(
								'propertyName'
							)}
							options={supportedProperties.map(
								({label, name}) => ({
									label,
									value: name
								})
							)}
							selected={selectedProperty && selectedProperty.name}
						/>

						<ClaySelect
							className="criterion-input operator-input form-control"
							onChange={this._handleInputChange(
								'operatorName'
							)}
							options={supportedOperators.map(
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
							onChange={this._handleInputChange('value')}
							type="text"
							value={criterion && criterion.value}
						/>

						<ClayButton
							className="btn-monospaced delete-button"
							iconName="trash"
							onClick={this._handleDelete}
						/>
					</div>
				) : (
					<div className="read-only-container">
						<span className="criteria-string">
							{`${Liferay.Language.get('property')} `}

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
}

const dropZoneTarget = {
	drop(props, monitor) {
		const {criterion, onChange, supportedOperators} = props;

		const {name} = monitor.getItem();

		const newCriterion = {
			operatorName: supportedOperators[0].name,
			propertyName: name,
			value: ''
		};

		const newGroup = {
			conjunctionName: CONJUNCTIONS.AND,
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
)(CriteriaRow);