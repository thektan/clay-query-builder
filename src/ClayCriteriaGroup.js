import React from 'react';
import {PropTypes} from 'prop-types';
import ClayCriteriaRow from './ClayCriteriaRow';
import ClayButton from './ClayButton';
import './css/ClayCriteriaGroup.scss';

const ID_PREFIX = 'group_';

let groupId = 0;

/**
 * Generate a unique id for the group.
 * @return {number} the unique group id.
 */
function generateId() {
	return ID_PREFIX + groupId++;
}

/**
 * Inserts an item at the specified index.
 * @param {?} item Item to insert into the list.
 * @param {array} list The list the item will be inserted in.
 * @param {number} index Position where the item will be inserted in.
 * @return {array} Array with the inserted item.
 */
function insertAtIndex(item, list, index) {
	return [...list.slice(0, index), item, ...list.slice(index, list.length)];
}

/**
 * A container for query rows and query groups.
 *
 * @class ClayQueryGroup
 * @extends {Component}
 */
class ClayCriteriaGroup extends React.Component {
	/**
	 * @inheritdoc
	 */
	constructor(props) {
		super(props);

		this.groupId = generateId();
	}

	/**
	 * Gets the conjunction object containing a label and value from the
	 * selected id.
	 *
	 * @param {string} conjunctionName
	 * @return {Object} Conjunction object
	 * @memberof ClayQueryGroup
	 */
	_getConjunctionLabel(conjunctionName, conjunctions) {
		return conjunctions.find(({name}) => name === conjunctionName).label;
	}

	render() {
		const {
			conjunctions,
			editing,
			properties,
			criteriaTypes,
			operators,
			criteria,
			root,
			spritemap
		} = this.props;

		const selectedConjunctionName = this._getConjunctionLabel(
			criteria.conjunctionName,
			conjunctions
		);

		return (
			<div className="query-group sheet" styleName="container">
				{criteria.items.map((criterion, index) => {
					return (
						<div className="container" key={index}>
							{index != 0 && (
								<div className="query-conjunction-section">
									<ClayButton
										label={selectedConjunctionName}
										onClick={this._handleConjunctionClick}
									/>
								</div>
							)}

							<ClayCriteriaRow
								conjunctions={conjunctions}
								criteriaTypes={criteriaTypes}
								criterion={criterion}
								editing={editing}
								index={index}
								onChange={this._updateCriterion}
								operators={operators}
								properties={properties}
								spritemap={spritemap}
							/>

							{editing && (
								<ClayButton
									label={'Add'}
									onClick={this._handleAddCriteria(index)}
								/>
							)}
						</div>
					);
				})}
			</div>
		);
	}

	/**
	 * Adds a new criteria row.
	 *
	 * @private
	 */
	_handleAddCriteria = index => () => {
		const {criteria, onChange, operators, properties} = this.props;

		const emptyItem = {
			operatorName: operators[0].name,
			propertyName: properties[0].name,
			value: ''
		};

		onChange(
			Object.assign(criteria, {
				items: insertAtIndex(emptyItem, criteria.items, index + 1)
			})
		);
	};

	/**
	 * Cycles through conjunctions.
	 *
	 * @private
	 */
	_handleConjunctionClick = () => {
		const {conjunctions, onChange, criteria} = this.props;

		const index = conjunctions.findIndex(
			item => item.name === criteria.conjunctionName
		);

		const conjunctionSelected =
			index === conjunctions.length - 1
				? conjunctions[0].name
				: conjunctions[index + 1].name;

		onChange(
			Object.assign(criteria, {
				conjunctionName: conjunctionSelected
			})
		);
	};

	/**
	 * Update the query builder's query with the new query.
	 *
	 * @param {number} index
	 * @param {Object} newCriterion
	 */
	_updateCriterion = (index, newCriterion) => {
		const {criteria, onChange} = this.props;

		onChange(
			Object.assign(criteria, {
				items: newCriterion
					? Object.assign(criteria.items, {
						[index]: newCriterion
					  })
					: criteria.items.filter((fItem, fIndex) => fIndex !== index)
			})
		);
	};
}

ClayCriteriaGroup.propTypes = {
	criteriaTypes: PropTypes.object,
	conjunctions: PropTypes.array,
	editing: PropTypes.bool,
	selectedConjunctionName: PropTypes.string,
	criteria: PropTypes.object,
	onChange: PropTypes.func,
	operators: PropTypes.array,
	properties: PropTypes.array,
	spritemap: PropTypes.string
};

ClayCriteriaGroup.defaultProps = {
	root: false
}

export default ClayCriteriaGroup;