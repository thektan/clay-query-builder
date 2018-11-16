import React from 'react';
import {PropTypes} from 'prop-types';
import ClayQueryRow from './ClayQueryRow';

const ID_PREFIX = 'group_';

let groupId = 0;

/**
 * Generate a unique id for the group.
 *
 * @return {number} the unique group id.
 */
function generateId() {
	return ID_PREFIX + groupId++;
}

/**
 * A container for query rows and query groups.
 *
 * @class ClayQueryGroup
 * @extends {Component}
 */
class ClayQueryGroup extends React.Component {
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
	 * @param {string} conjunctionId
	 * @return {Object} Conjunction object
	 * @memberof ClayQueryGroup
	 */
	_getConjunctionName(conjunctionId, conjunctions) {
		return conjunctions.find(
			({value}) => value === conjunctionId
		).label;
	}

	render() {
		const {
			conjunctions,
			criteria,
			criteriaTypes,
			operators,
			query,
			spritemap
		} = this.props;

		const selectedConjunctionName = this._getConjunctionName(query.conjunctionId, conjunctions);

		return (
			<div className="query-group sheet">
				{query.items.map(
					(queryItem, index) => {
						return (
							<div className="container" key={index}>
								{index != 0 && (
									<div className="query-conjunction-section">
										<button 
											className={`query-conjunction query conjunction-${selectedConjunctionName} sm`}
											onClick={this._handleConjunctionClick}
										>
											<span>{selectedConjunctionName}</span>
										</button>
									</div>
								)}

								<ClayQueryRow
									queryItem={queryItem}
									criteria={criteria}
									criteriaTypes={criteriaTypes}
									conjunctions={conjunctions}
									index={index}
									updateQueryRow={this._updateQueryRow}
									operators={operators}
									spritemap={spritemap}
								/>

								<button 
									onClick={this._handleAddCriteria(this.groupId, index)}
								>
									<span>Add</span>
								</button>
							</div>
						)
					}
				)}
			</div>
		);
	}

	/**
	 * Adds a new criteria row.
	 *
	 * @param {Event} event
	 * @param {Object} data
	 * @memberof ClayQueryGroup
	 */
	_handleAddCriteria = index => event => {
		
	}

	/**
	 * Cycles through conjunctions.
	 *
	 * @private
	 */
	_handleConjunctionClick = () => {
		const {conjunctions, updateQuery, query} = this.props;

		const index = conjunctions.findIndex(
			item => item.value === query.conjunctionId
		);

		const conjunctionSelected =
			index === conjunctions.length - 1
				? conjunctions[0].value
				: conjunctions[index + 1].value;

		updateQuery(
			Object.assign(
				query, 
				{
					conjunctionId: conjunctionSelected
				}
			)
		);
	}

	/**
	 * Update the query builder's query with the new query.
	 *
	 * @param {number} index
	 * @param {Object} newQueryItems
	 * @memberof ClayQueryGroup
	 */
	_updateQueryRow = (index, newQueryItems) => {
		const {query, updateQuery} = this.props;

		updateQuery(
			Object.assign(query, {
				items: newQueryItems
					? Object.assign(query.items, {
						[index]: newQueryItems
					  })
					: query.items.filter((fItem, fIndex) => fIndex !== index)
			})
		);
	}
}

ClayQueryGroup.propTypes = {
	/**
	 * Unique id of the group used for identifying item groups.
	 */
	criteriaTypes: PropTypes.object,
	conjunctions: PropTypes.array,
	selectedConjunctionName: PropTypes.string,
	query: PropTypes.object,
	updateQuery: PropTypes.func
};

export default ClayQueryGroup;