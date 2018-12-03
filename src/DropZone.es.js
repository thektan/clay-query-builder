import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DropTarget as dropTarget} from 'react-dnd';
import {DragTypes} from './utils/drag-types';

class DropZone extends Component {
	render() {
		const {
			before,
			connectDropTarget,
			hover
		} = this.props;

		return (
			<div className="drop-zone-root">
				{connectDropTarget(
					<div
						className={`drop-zone-target ${before ? 'drop-zone-target-before' : ''}`}
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

const DND_PROPS = {
	connectDropTarget: PropTypes.func,
	hover: PropTypes.bool
};

DropZone.propTypes = {
	...DND_PROPS,
	before: PropTypes.bool,
	index: PropTypes.number,
	onAddCriteria: PropTypes.func
};

const dropZoneTarget = {
	drop(props, monitor) {
		const {name} = monitor.getItem();

		props.onAddCriteria(props.index, name);
	}
};

export default dropTarget(
	DragTypes.PROPERTY,
	dropZoneTarget,
	(connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		hover: monitor.isOver()
	})
)(DropZone);