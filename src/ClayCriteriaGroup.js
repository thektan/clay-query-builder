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
			criteria,
			criteriaTypes,
			editing,
			operators,
			properties,
			root
		} = this.props;

		return (
			<div
				className="query-group"
				styleName={root ? 'root-criteria-group' : ' criteria-group'}
			>
				{criteria.items.map((criterion, index) => {
					return (
						<div key={index} styleName="criterion">
							{index != 0 && (
								<ClayButton
									className="btn-sm btn btn-secondary"
									label={this._getConjunctionLabel(
										criteria.conjunctionName,
										conjunctions
									)}
									onClick={this._handleConjunctionClick}
									styleName="conjunction"
								/>
							)}

							<div styleName="criterion-row">
								<ClayCriteriaRow
									conjunctions={conjunctions}
									criteriaTypes={criteriaTypes}
									criterion={criterion}
									editing={editing}
									index={index}
									onChange={this._updateCriterion}
									operators={operators}
									properties={properties}
									root={root}
								/>

								<ClayButton
									className="btn-sm btn btn-secondary"
									iconName="plus"
									onClick={this._handleAddCriteria(index)}
									styleName="add"
								/>
							</div>
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
		const {conjunctions, criteria, onChange} = this.props;

		const index = conjunctions.findIndex(
			item => item.name === criteria.conjunctionName
		);

		const conjunctionSelected =
			index === conjunctions.length - 1 ?
				conjunctions[0].name :
				conjunctions[index + 1].name;

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
				items: newCriterion ?
					Object.assign(criteria.items, {
						[index]: newCriterion
						}) :
					criteria.items.filter((fItem, fIndex) => fIndex !== index)
			})
		);
	};
}

ClayCriteriaGroup.propTypes = {
	conjunctions: PropTypes.array,
	criteria: PropTypes.object,
	criteriaTypes: PropTypes.object,
	editing: PropTypes.bool,
	onChange: PropTypes.func,
	operators: PropTypes.array,
	properties: PropTypes.array,
	root: PropTypes.bool,
	selectedConjunctionName: PropTypes.string,
	spritemap: PropTypes.string
};

ClayCriteriaGroup.defaultProps = {
	root: false
};

export default ClayCriteriaGroup;