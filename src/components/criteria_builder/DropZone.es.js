import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DropTarget as dropTarget} from 'react-dnd';
import {DragTypes} from '../../utils/drag-types.es';
import getCN from 'classnames';

class DropZone extends Component {
	static propTypes = {
		before: PropTypes.bool,
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
						{hover &&
							<div className="drop-zone-indicator" />
						}
					</div>
				)}
			</div>
		);
	}
}

const acceptedDragTypes = [
	DragTypes.CRITERIA_ROW,
	DragTypes.PROPERTY
];

const dropZoneTarget = {
	drop(props, monitor) {
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

		if (itemType === DragTypes.PROPERTY) {
			onCriterionAdd(destIndex, criterion);
		}
		else if (itemType === DragTypes.CRITERIA_ROW) {
			onMove(startGroupId, startIndex, destGroupId, destIndex, criterion);
		}
	}
};

export default dropTarget(
	acceptedDragTypes,
	dropZoneTarget,
	(connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		hover: monitor.isOver()
	})
)(DropZone);