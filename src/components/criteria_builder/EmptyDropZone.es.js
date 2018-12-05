import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DropTarget as dropTarget} from 'react-dnd';
import {DragTypes} from '../../utils/drag-types.es';
import ThemeContext from '../../ThemeContext.es';

import {Liferay} from '../../utils/language';

class EmptyDropZone extends Component {
	static contextType = ThemeContext;

	render() {
		const {
			connectDropTarget,
			hover
		} = this.props;

		const {assetsPath} = this.context;

		return (
			<div className="empty-drop-zone-root">
				{connectDropTarget(
					<div
						className={`empty-drop-zone-target ${hover ? 'dnd-hover' : ''}`}
					>
						<div className="empty-drop-zone-indicator" />

						<div className="empty-drop-zone-help-message">
							<div className="message-item">
								<img
									className="message-icon"
									src={`${assetsPath}/drag-and-drop.svg`}
								/>

								<span>
									{Liferay.Language.get('drag-and-drop-criterion-from-the-right-to-add-rules')}
								</span>
							</div>

							<div className="message-item">
								<img
									className="message-icon"
									src={`${assetsPath}/drag-over.svg`}
								/>

								<span>
									{Liferay.Language.get('drag-and-drop-over-an-existing-criteria-to-form-groups')}
								</span>
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