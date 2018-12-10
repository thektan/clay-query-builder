import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import ClayButton from '../shared/ClayButton.es';
import ClayIcon from '../shared/ClayIcon.es';
import ClaySelect from '../shared/ClaySelect.es';
import {CONJUNCTIONS} from '../../utils/constants.es';
import {DragSource as dragSource, DropTarget as dropTarget} from 'react-dnd';
import {DragTypes} from '../../utils/drag-types.es';
import getCN from 'classnames';
import {generateGroupId, sub} from '../../utils/utils.es';

import {Liferay} from '../../utils/language';

class CriteriaRow extends Component {
	static propTypes = {
		canDrop: PropTypes.bool,
		connectDragPreview: PropTypes.func,
		connectDragSource: PropTypes.func,
		connectDropTarget: PropTypes.func,
		criterion: PropTypes.object,
		editing: PropTypes.bool,
		groupId: PropTypes.string,
		hover: PropTypes.bool,
		index: PropTypes.number,
		onChange: PropTypes.func,
		onDelete: PropTypes.func,
		onMove: PropTypes.func,
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
		const {criterion, onChange} = this.props;

		onChange(
			{
				...criterion,
				[propertyName]: event.target.value
			}
		);
	};

	_handleDelete = event => {
		if (event) {
			event.preventDefault();
		}

		const {index, onDelete} = this.props;

		onDelete(index);
	}

	render() {
		const {
			canDrop,
			connectDragPreview,
			connectDragSource,
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
				'dnd-hover': hover && canDrop
			}
		);

		return connectDropTarget(
			connectDragPreview(
				<div
					className={classes}
				>
					{editing ? (
						<div className="edit-container">
							{connectDragSource(
								<div className="drag-icon">
									<ClayIcon iconName="drag" />
								</div>
							)}

							{sub(
								// Liferay.Language.get('x-with-property-x'),
								'{0} with property {1}',
								[
									'User',
									<b key="property">
										{selectedProperty && selectedProperty.label}
									</b>
								],
								false
							)}

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
								{sub(
									// Liferay.Language.get('x-with-property-x-x-x'),
									'{0} with property {1} {2} {3}',
									[
										'User',
										<b key="property">
											{selectedProperty && selectedProperty.label}
										</b>,
										selectedOperator && selectedOperator.label,
										<b key="value">
											{criterion && criterion.value}
										</b>
									],
									false
								)}
							</span>
						</div>
					)}
				</div>
			)
		);
	}
}

const acceptedDragTypes = [
	DragTypes.CRITERIA_ROW,
	DragTypes.PROPERTY
];

const dropZoneTarget = {
	canDrop(props, monitor) {
		const {groupId: destGroupId, index: destIndex} = props;
		const {groupId: startGroupId, index: startIndex} = monitor.getItem();

		return destGroupId !== startGroupId || destIndex !== startIndex;
	},
	drop(props, monitor) {
		const {
			criterion,
			groupId: destGroupId,
			index: destIndex,
			onChange,
			onMove,
			supportedOperators
		} = props;

		const {
			criterion: droppedCriterion,
			groupId: startGroupId,
			index: startIndex
		} = monitor.getItem();

		const {operatorName, propertyName, value} = droppedCriterion;

		const newCriterion = {
			operatorName: operatorName ?
				operatorName :
				supportedOperators[0].name,
			propertyName,
			value: value ? value : ''
		};

		const newGroup = {
			conjunctionName: CONJUNCTIONS.AND,
			groupId: generateGroupId(),
			items: [criterion, newCriterion]
		};

		const itemType = monitor.getItemType();

		if (itemType === DragTypes.PROPERTY) {
			onChange(newGroup);
		}
		else if (itemType === DragTypes.CRITERIA_ROW) {
			onMove(
				startGroupId,
				startIndex,
				destGroupId,
				destIndex,
				newGroup,
				true
			);
		}
	}
};

const criteriaRowSource = {
	beginDrag({criterion, groupId, index}) {
		return {criterion, groupId, index};
	}
};

const CriteriaRowWithDrag = dragSource(
	DragTypes.CRITERIA_ROW,
	criteriaRowSource,
	(connect, monitor) => ({
		connectDragPreview: connect.dragPreview(),
		connectDragSource: connect.dragSource(),
		dragging: monitor.isDragging()
	})
)(CriteriaRow);

export default dropTarget(
	acceptedDragTypes,
	dropZoneTarget,
	(connect, monitor) => ({
		canDrop: monitor.canDrop(),
		connectDropTarget: connect.dropTarget(),
		hover: monitor.isOver()
	})
)(CriteriaRowWithDrag);