import Component from 'metal-component';
import Soy from 'metal-soy';
import {Config} from 'metal-state';

import templates from './ClayQueryGroup.soy.js';

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
class ClayQueryGroup extends Component {
	/**
	 * @inheritdoc
	 */
	created() {
		this._handleConjunctionClick = this._handleConjunctionClick.bind(this);

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
	_getConjunctionName(conjunctionId) {
		return this.conjunctions.find(({value}) => value === conjunctionId)
			.label;
	}

	/**
	 * @inheritdoc
	 */
	prepareStateForRender(states) {
		const newState = Object.assign(states, {
			selectedConjunctionName: this._getConjunctionName(
				states.query.conjunctionId
			)
		});

		return newState;
	}

	/**
	 * Cycles through conjunctions.
	 *
	 * @private
	 */
	_handleConjunctionClick() {
		const {conjunctions, query} = this;

		const index = conjunctions.findIndex(
			item => item.value === query.conjunctionId
		);

		const conjunctionSelected =
			index === conjunctions.length - 1
				? conjunctions[0].value
				: conjunctions[index + 1].value;

		this.updateQuery(
			Object.assign(this.query, {
				conjunctionId: conjunctionSelected
			})
		);
	}

	/**
	 * Update the query builder's query with the new query.
	 *
	 * @param {number} index
	 * @param {Object} newQueryItems
	 * @memberof ClayQueryGroup
	 */
	_updateQueryRow(index, newQueryItems) {
		const {query} = this;

		this.updateQuery(
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

ClayQueryGroup.STATE = {
	/**
	 * Unique id of the group used for identifying item groups.
	 */
	groupId: Config.string(),
	conjunctions: Config.array(),
	selectedConjunctionName: Config.string(),
	query: Config.object(),
	updateQuery: Config.func()
};

Soy.register(ClayQueryGroup, templates);

export {ClayQueryGroup};
export default ClayQueryGroup;