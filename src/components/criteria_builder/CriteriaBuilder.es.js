import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ClayToggle from '../shared/ClayToggle.es';
import CriteriaGroup from './CriteriaGroup.es';
import CriteriaSidebar from '../criteria_sidebar/CriteriaSidebar.es';
import {DragDropContext as dragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {insertAtIndex, removeAtIndex} from '../../utils/utils.es';

import {Liferay} from '../../utils/language';

const CRITERIA_GROUP_SHAPE = {
	conjunctionName: PropTypes.string,
	groupId: PropTypes.string,
	items: PropTypes.array
};

const CRITERION_SHAPE = {
	operatorName: PropTypes.string,
	propertyName: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

class CriteriaBuilder extends Component {
	static propTypes = {
		criteria: PropTypes.shape(
			{
				conjunctionName: PropTypes.string,
				groupId: PropTypes.string,
				items: PropTypes.arrayOf(
					PropTypes.oneOfType(
						[
							PropTypes.shape(CRITERIA_GROUP_SHAPE),
							PropTypes.shape(CRITERION_SHAPE)
						]
					)
				)
			}
		),
		onChange: PropTypes.func,
		supportedConjunctions: PropTypes.arrayOf(
			PropTypes.shape(
				{
					label: PropTypes.string,
					name: PropTypes.string.isRequired
				}
			)
		),
		supportedOperators: PropTypes.array,
		supportedProperties: PropTypes.arrayOf(
			PropTypes.shape(
				{
					entityUrl: PropTypes.string,
					label: PropTypes.string,
					name: PropTypes.string.isRequired,
					options: PropTypes.array,
					type: PropTypes.string.isRequired
				}
			)
		).isRequired,
		supportedPropertyTypes: PropTypes.object
	};

	static defaultProps = {
		readOnly: false
	};

	state = {
		editing: false
	};

	/**
	 * Cleans the criteria by performing the following:
	 * 1. Remove any groups with no items.
	 * 2. Flatten groups that directly contain a single group.
	 * 3. Flatten groups that contain a single criterion.
	 * @param {array} criteriaItems A list of criterion and criteria groups
	 * @param {boolean} root True if the criteriaItems are from the root group.
	 * to clean.
	 */
	_cleanCriteriaMapItems(criteriaItems, root) {
		return criteriaItems
			.filter(
				({items}) => (items ? items.length : true)
			)
			.map(
				item => {
					let cleanedItem = item;

					if (item.items) {
						if (item.items.length === 1) {
							const soloItem = item.items[0];

							if (soloItem.items) {
								cleanedItem = {
									conjunctionName: soloItem.conjunctionName,
									groupId: soloItem.groupId,
									items: this._cleanCriteriaMapItems(soloItem.items)
								};
							}
							else {
								cleanedItem = root ? item : soloItem;
							}
						}
						else {
							cleanedItem = {
								...item,
								...{
									items: this._cleanCriteriaMapItems(item.items)
								}
							};
						}
					}

					return cleanedItem;
				}
			);
	}

	_handleToggleEdit = () => {
		this.setState(
			{
				editing: !this.state.editing
			}
		);
	};

	_handleCriteriaChange = newCriteria => {
		this.props.onChange(this._cleanCriteriaMapItems([newCriteria], true).pop());
	};

	_handleCriterionMove = (
		startGroupId,
		startIndex,
		destGroupId,
		destIndex,
		criterion
	) => {
		const newCriteria = this._searchAndUpdateCriteria(
			this.props.criteria,
			startGroupId,
			startIndex,
			destGroupId,
			destIndex,
			criterion
		);

		this._handleCriteriaChange(newCriteria);
	}

	/**
	 * Checks if an item is a group item by checking if it contains an items
	 * property with at least 1 item.
	 * @param {object} item The criteria item to check.
	 * @returns True if the item is a group.
	 */
	_isGroupItem(item) {
		return item.items && item.items.length;
	}

	/**
	 * Searches through the criteria object and adds and removes the criterion
	 * at their respective specified index.
	 * Used for moving a criterion between groups.
	 * @param {object} criteria The criteria object to update.
	 * @param {object} addCriterion The criterion that is being moved.
	 */
	_searchAndUpdateCriteria = (
		criteria,
		removeGroupId,
		removeIndex,
		addGroupId,
		addIndex,
		addCriterion
	) => {
		let updatedCriteriaItems = criteria.items;

		if (criteria.groupId === addGroupId) {
			updatedCriteriaItems = insertAtIndex(
				addCriterion,
				updatedCriteriaItems,
				addIndex
			);
		}

		if (criteria.groupId === removeGroupId) {
			updatedCriteriaItems = removeAtIndex(
				updatedCriteriaItems,
				addGroupId === removeGroupId && addIndex < removeIndex ?
					removeIndex + 1 :
					removeIndex
			);
		}

		return {
			...criteria,
			items: updatedCriteriaItems.map(
				item => this._isGroupItem(item) ?
					this._searchAndUpdateCriteria(
						item,
						removeGroupId,
						removeIndex,
						addGroupId,
						addIndex,
						addCriterion
					) :
					item
			)
		};
	}

	render() {
		const {
			criteria,
			supportedConjunctions,
			supportedOperators,
			supportedProperties,
			supportedPropertyTypes
		} = this.props;

		const {editing} = this.state;

		return (
			<div className="criteria-builder-root">
				<div className="criteria-builder-section-main">
					<div className="criteria-builder-toolbar">
						<ClayToggle
							checked={editing}
							iconOff="pencil"
							iconOn="pencil"
							onChange={this._handleToggleEdit}
						/>
					</div>

					<CriteriaGroup
						criteria={criteria}
						editing={editing}
						groupId={criteria && criteria.groupId}
						onChange={this._handleCriteriaChange}
						onMove={this._handleCriterionMove}
						root
						supportedConjunctions={supportedConjunctions}
						supportedOperators={supportedOperators}
						supportedProperties={supportedProperties}
						supportedPropertyTypes={supportedPropertyTypes}
					/>
				</div>

				<div className="criteria-builder-section-sidebar">
					<CriteriaSidebar
						supportedProperties={supportedProperties}
						title={Liferay.Language.get('properties')}
					/>
				</div>
			</div>
		);
	}
}

export default dragDropContext(HTML5Backend)(CriteriaBuilder);