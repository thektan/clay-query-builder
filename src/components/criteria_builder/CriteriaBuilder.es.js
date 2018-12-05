import React from 'react';
import PropTypes from 'prop-types';
import CriteriaGroup from './CriteriaGroup.es';
import CriteriaSidebar from '../criteria_sidebar/CriteriaSidebar.es';
import {DragDropContext as dragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import {Liferay} from '../../utils/language';
import ClayToggle from './ClayToggle.es';

class ClayCriteriaBuilder extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			editing: false,
			initialCriteria: this.props.criteria
		};
	}

	render() {
		const {
			criteria,
			operators,
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
						onChange={this._updateCriteria}
						operators={operators}
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

	/**
	 * Cleans the criteria by performing the following in order:
	 * 1. Remove any groups with no items.
	 * 2. Flatten groups that directly contain a single group.
	 * 3. Flatten groups that contain a single criterion.
	 * @param {array} criteriaItems A list of criterion and criteria groups
	 * to clean.
	 */
	_cleanCriteriaMapItems(criteriaItems, root) {
		return criteriaItems
			.filter(
				({items}) => (items ? items.length : true)
			)
			.map(
				item => {
					if (item.items) {
						// If the item is a group.
						if (item.items.length === 1) {
							// If the group only has 1 item.
							const soloItem = item.items[0];

							if (soloItem.items) {
								// Flatten group that contain a single group.
								return (
									{
										conjunctionName: soloItem.conjunctionName,
										items: this._cleanCriteriaMapItems(soloItem.items)
									}
								);
							}
							else {
								// Flatten non-root group that contain a single criterion.
								return root ? item : soloItem;
							}
						}
						else {
							// Recursively clean the nested groups.
							return Object.assign(
								item,
								{
									items: this._cleanCriteriaMapItems(item.items)
								}
							);
						}
					}
					else {
						return item;
					}
				}
			);
	}

	_handleNewCriteria = () => {
		const {onChange, supportedOperators, supportedProperties} = this.props;

		const emptyItem = {
			operatorName: supportedOperators[0].name,
			propertyName: supportedProperties[0].name,
			value: ''
		};

		onChange(
			{
				conjunctionName: 'and',
				items: [emptyItem]
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

	_updateCriteria = newCriteria => {
		this.props.onChange(this._cleanCriteriaMapItems([newCriteria], true).pop());
	};
}

const CRITERIA_GROUP_SHAPE = {
	conjunctionName: PropTypes.string,
	items: PropTypes.array
};

const CRITERION_SHAPE = {
	operatorName: PropTypes.string,
	propertyName: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

ClayCriteriaBuilder.propTypes = {
	criteria: PropTypes.shape(
		{
			conjunctionName: PropTypes.string,
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
	operators: PropTypes.arrayOf(
		PropTypes.shape(
			{
				supportedTypes: PropTypes.arrayOf(PropTypes.string),
				value: PropTypes.string
			}
		)
	),
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

ClayCriteriaBuilder.defaultProps = {
	readOnly: false
};

export default dragDropContext(HTML5Backend)(ClayCriteriaBuilder);