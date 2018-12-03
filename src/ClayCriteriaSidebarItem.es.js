import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ClayIcon from './ClayIcon.es';
import {DragSource as dragSource} from 'react-dnd';
import {DragTypes} from './utils/drag-types';

class ClayCriteriaSidebarItem extends Component {
	render() {
		const {
			connectDragSource,
			isDragging,
			label,
			type
		} = this.props;

		return connectDragSource(
			<li>
				<ClayIcon iconName="drag" />

				{type} - {label}

				{isDragging && 'dragging'}
			</li>
		);
	}
}

const DND_PROPS = {
	connectDragSource: PropTypes.func,
	isDragging: PropTypes.bool
};

ClayCriteriaSidebarItem.propTypes = {
	...DND_PROPS,
	label: PropTypes.string,
	name: PropTypes.string,
	type: PropTypes.string
};

const propertySource = {
	beginDrag({name}) {
		return {name};
	}
};

export default dragSource(
	DragTypes.PROPERTY,
	propertySource,
	(connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	})
)(ClayCriteriaSidebarItem);