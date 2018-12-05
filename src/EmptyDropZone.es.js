import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DropTarget as dropTarget} from 'react-dnd';
import {DragTypes} from './utils/drag-types.es';
import {Liferay} from './utils/language';

class EmptyDropZone extends Component {
	render() {
		const {
			connectDropTarget,
			hover
		} = this.props;

		return (
			<div className="empty-drop-zone-root">
				{connectDropTarget(
					<div
						className={`empty-drop-zone-target ${hover ? 'dnd-hover' : ''}`}
					>
						<div className="empty-drop-zone-indicator" />

						<div className="empty-drop-zone-help-message">
							<div>
								{Liferay.Language.get('drag-and-drop-criterion-from-the-right-to-add-rules')}
							</div>

							<div>
								{Liferay.Language.get('drag-and-drop-over-an-existing-criteria-to-form-groups')}
							</div>
						</div>
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

EmptyDropZone.propTypes = {
	...DND_PROPS,
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
)(EmptyDropZone);