import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DropTarget as dropTarget} from 'react-dnd';
import {DragTypes} from '../../utils/drag-types.es';
import getCN from 'classnames';

const {CRITERIA_GROUP, CRITERIA_ROW, PROPERTY} = DragTypes;

const acceptedDragTypes = [
	CRITERIA_GROUP,
	CRITERIA_ROW,
	PROPERTY
];

/**
 * Prevents groups from dropping within itself and all items from dropping into
 * a position that would not change its' current position.
 * This method must be called `canDrop`.
 * @param {Object} props Component's current props.
 * @param {DropTargetMonitor} monitor
 * @returns {boolean} True if the target should accept the item.
 */
function canDrop(props, monitor) {
	const {
		groupId: destGroupId,
		index: destIndex
	} = props;

	const {
		childGroupIds = [],
		criterion,
		groupId: startGroupId,
		index: startIndex
	} = monitor.getItem();

	const disallowedGroupIds = [criterion.groupId, ...childGroupIds];

	const sameOrNestedGroup = monitor.getItemType() === CRITERIA_GROUP &&
		disallowedGroupIds.includes(destGroupId);

	const sameIndexInSameGroup = startGroupId === destGroupId &&
		(startIndex === destIndex || startIndex === destIndex - 1);

	let droppable = true;

	if (sameOrNestedGroup || sameIndexInSameGroup) {
		droppable = false;
	}

	return droppable;
}

/**
 * Implements the behavior of what will occur when an item is dropped.
 * For properties dropped from the sidebar, a new criterion will be added.
 * For rows and groups being dropped, they will be moved to the dropped
 * position.
 * This method must be called `drop`.
 * @param {Object} props Component's current props.
 * @param {DropTargetMonitor} monitor
 */
function drop(props, monitor) {
	const {
		groupId: destGroupId,
		index: destIndex,
		onCriterionAdd,
		onMove
	} = props;

	const {
		criterion,
		groupId: startGroupId,
		index: startIndex
	} = monitor.getItem();

	const itemType = monitor.getItemType();

	if (itemType === PROPERTY) {
		onCriterionAdd(destIndex, criterion);
	}
	else if (itemType === CRITERIA_ROW || itemType === CRITERIA_GROUP) {
		onMove(startGroupId, startIndex, destGroupId, destIndex, criterion);
	}
}

class DropZone extends Component {
	static propTypes = {
		before: PropTypes.bool,
		canDrop: PropTypes.bool,
		connectDropTarget: PropTypes.func,
		groupId: PropTypes.string,
		hover: PropTypes.bool,
		index: PropTypes.number,
		onCriterionAdd: PropTypes.func,
		onMove: PropTypes.func
	};

	render() {
		const {
			before,
			canDrop,
			connectDropTarget,
			hover
		} = this.props;

		const targetClasses = getCN(
			'drop-zone-target',
			{
				'drop-zone-target-before': before
			}
		);

		return (
			<div className="drop-zone-root">
				{connectDropTarget(
					<div
						className={targetClasses}
					>
						{canDrop && hover &&
							<div className="drop-zone-indicator" />
						}
					</div>
				)}
			</div>
		);
	}
}

export default dropTarget(
	acceptedDragTypes,
	{
		canDrop,
		drop
	},
	(connect, monitor) => ({
		canDrop: monitor.canDrop(),
		connectDropTarget: connect.dropTarget(),
		hover: monitor.isOver()
	})
)(DropZone);