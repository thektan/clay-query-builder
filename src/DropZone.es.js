import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DropTarget as dropTarget} from 'react-dnd';
import {DragTypes} from './utils/drag-types';

class DropZone extends Component {
	static state = {
		before: false
	};

	render() {
		const {
			before,
			connectDropTarget,
			isOver
		} = this.props;

		return (
			<div className="drop-zone-root">
				{connectDropTarget(
					<div
						className={`drop-zone-target ${before && 'drop-zone-target-before'}`}
					>
						{isOver &&
							<div className="drop-zone-indicator" />
						}
					</div>
				)}
			</div>
		);
	}
}

const DND_PROPS = {
	connectDropTarget: PropTypes.func,
	isOver: PropTypes.bool
};

DropZone.propTypes = {
	...DND_PROPS,
	before: PropTypes.bool,
	index: PropTypes.number,
	onAddCriteria: PropTypes.func
};

const dropZoneTarget = {
	drop(props, monitor) {
		console.log('this was dropped', monitor.getItem());

		props.onAddCriteria(props.index);
	}
};

export default dropTarget(
	DragTypes.PROPERTY,
	dropZoneTarget,
	(connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver()
	})
)(DropZone);