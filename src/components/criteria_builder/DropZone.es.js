import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DropTarget as dropTarget} from 'react-dnd';
import {DragTypes} from '../../utils/drag-types.es';
import getCN from 'classnames';

class DropZone extends Component {
	static propTypes = {
		before: PropTypes.bool,
		connectDropTarget: PropTypes.func,
		hover: PropTypes.bool,
		index: PropTypes.number,
		onAddCriteria: PropTypes.func
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