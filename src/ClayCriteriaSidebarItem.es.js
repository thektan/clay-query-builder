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
			<li className={`criteria-sidebar-item-root ${isDragging ? 'dragging' : ''}`}>
				<span className="inline-item">
					<ClayIcon iconName="drag" />
				</span>

				<span className="criteria-sidebar-item-type sticker sticker-secondary">
					<span className="inline-item">
						<ClayIcon iconName={this._getIcon(type)} />
					</span>
				</span>

				{label}
			</li>
		);
	}

	_getIcon(type) {
		let returnValue;

		switch (type) {
			case 'boolean':
				returnValue = 'text';
				break;
			case 'date':
				returnValue = 'date';
				break;
			case 'number':
				returnValue = 'number';
				break;
			case 'string':
				returnValue = 'text';
				break;
			default:
				returnValue = 'text';
		}

		return returnValue;
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