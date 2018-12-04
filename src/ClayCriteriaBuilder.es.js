import React from 'react';
import PropTypes from 'prop-types';
import ClayCriteriaGroup from './ClayCriteriaGroup.es';
import ClayCriteriaSidebar from './ClayCriteriaSidebar.es';
import {DragDropContext as dragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import {Liferay} from './utils/language';
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
		const {conjunctions, criteria, operators, properties} = this.props;

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

					{this._isCriteriaEmpty() ? (
						<div
							className="empty-state"
							onClick={this._handleNewCriteria}
						>
							{Liferay.Language.get('click-to-start-editing')}
						</div>
					) : (
						<ClayCriteriaGroup
							conjunctions={conjunctions}
							criteria={criteria}
							criteriaTypes={ClayCriteriaBuilder._buildCriteriaTypes(
								operators
							)}
							editing={editing}
							onChange={this._updateCriteria}
							operators={operators}
							properties={properties}
							root
						/>
					)}
				</div>

				<div className="criteria-builder-section-sidebar">
					<ClayCriteriaSidebar
						properties={properties}
						title={Liferay.Language.get('properties')}
					/>
				</div>
			</div>
		);
	}

	static _buildCriteriaTypes(operators) {
		return operators.reduce(
			(criteriaTypes, {supportedTypes}) => {
				supportedTypes.forEach(
					type => {
						if (!criteriaTypes[type]) {
							criteriaTypes[type] = operators.filter(
								operator =>
									operator.supportedTypes.includes(type)
							);
						}
					}
				);

				return criteriaTypes;
			},
			new Map()
		);
	}

	/**
	 * Cleans the criteria by performing the following:
	 * - Remove any groups with no items.
	 * - Flatten groups that directly contain a single group.
	 * - Flatten groups that contain a single criterion.
	 * @param {array} criteriaItems A list of criterion and criteria groups
	 * to clean.
	 */
	_cleanCriteriaMapItems(criteriaItems, root) {
		return criteriaItems
			// Remove groups with no items.
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
		const {onChange, operators, properties} = this.props;

		const emptyItem = {
			operatorName: operators[0].name,
			propertyName: properties[0].name,
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

	_isCriteriaEmpty = () => {
		const {criteria} = this.props;

		return criteria ? !criteria.items.length : true;
	}

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
	conjunctions: PropTypes.arrayOf(
		PropTypes.shape(
			{
				label: PropTypes.string,
				value: PropTypes.string
			}
		)
	),
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
	properties: PropTypes.arrayOf(
		PropTypes.shape(
			{
				entityUrl: PropTypes.string,
				label: PropTypes.string,
				name: PropTypes.string.isRequired,
				options: PropTypes.array,
				type: PropTypes.string
			}
		)
	).isRequired,
	readOnly: PropTypes.bool,
	spritemap: PropTypes.string
};

ClayCriteriaBuilder.defaultProps = {
	readOnly: false
};

export default dragDropContext(HTML5Backend)(ClayCriteriaBuilder);