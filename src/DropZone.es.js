import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DropTarget as dropTarget} from 'react-dnd';
import {DragTypes} from './utils/drag-types';

class DropZone extends Component {
	render() {
		const {
			connectDropTarget,
			isOver
		} = this.props;

		return connectDropTarget(
			<div>
				{`DROP IT LIKE IT'S HOT`} {isOver && `IT'S OVER`}
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
	index: PropTypes.number,
	onAddCriteria: PropTypes.func
};

const dropZoneTarget = {
	drop(props, monitor) {
		console.log('this was dropped', monitor.getItem());

		// props.onAddCriteria(props.index);
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