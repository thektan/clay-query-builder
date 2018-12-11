import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ClayIcon from '../shared/ClayIcon.es';
import {DragSource as dragSource} from 'react-dnd';
import {DragTypes} from '../../utils/drag-types.es';
import getCN from 'classnames';

class CriteriaSidebarItem extends Component {
	static propTypes = {
		connectDragSource: PropTypes.func,
		dragging: PropTypes.bool,
		label: PropTypes.string,
		name: PropTypes.string,
		type: PropTypes.string
	};

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

	render() {
		const {
			connectDragSource,
			dragging,
			label,
			type
		} = this.props;

		const classes = getCN(
			'criteria-sidebar-item-root',
			{dragging}
		);

		return connectDragSource(
			<li className={classes}>
				<span className="inline-item">
					<ClayIcon iconName="drag" />
				</span>

				<span className="criteria-sidebar-item-type sticker sticker-light">
					<span className="inline-item">
						<ClayIcon iconName={this._getIcon(type)} />
					</span>
				</span>

				{label}
			</li>
		);
	}
}

const propertySource = {
	beginDrag({name}) {
		return {
			criterion: {
				propertyName: name
			}
		};
	}
};

export default dragSource(
	DragTypes.PROPERTY,
	propertySource,
	(connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		dragging: monitor.isDragging()
	})
)(CriteriaSidebarItem);