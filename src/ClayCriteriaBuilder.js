import React from 'react';
import PropTypes from 'prop-types';
import ClayCriteriaGroup from './ClayCriteriaGroup';
import './css/ClayCriteriaBuilder.scss';

/**
 * A component used for building a query string.
 * Combines multiple queries together. A query has a
 * structure of criteria, operator, and value.
 */
class ClayCriteriaBuilder extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			initialCriteria: this.props.criteria,
			editing: false
		};
	}

	render() {
		const {
			properties,
			conjunctions,
			operators,
			criteria,
			spritemap
		} = this.props;

		const {
			initialCriteria,
			editing
		} = this.state;
	
		return (
			<div styleName="criteria-builder">
				<div styleName='toolbar'>
					<ClayButton styleName='edit' onClick={this._handleToggleEdit} label='Edit' />
				</div>
			
				{criteria ? (
					<ClayCriteriaGroup 
						editing={editing}
						properties={properties}
						criteriaTypes={ClayCriteriaBuilder._buildCriteriaTypes(operators)}
						conjunctions={conjunctions}
						operators={operators}
						onChange={this._updateCriteria}
						criteria={criteria}
						root
					/>
				) : (
					<span>{'There is nothing'}</span>
				)}
			</div>
		);
	}

	/**
	 * Builds a map of criteria types and their supported operators.
	 *
	 * @returns Map of criteria types.
	 */
	static _buildCriteriaTypes(operators) {
		return operators.reduce((criteriaTypes, {supportedTypes}) => {
			supportedTypes.forEach(type => {
				if (!criteriaTypes[type]) {
					criteriaTypes[type] = operators.filter(operator =>
						operator.supportedTypes.includes(type)
					);
				}
			});

			return criteriaTypes;
		}, new Map());
	}

	/**
	 * Cleans up the query state by removing any groups with no items.
	 *
	 * @param {array} criterion The criteria to clean up.
	 * @returns {object} The cleaned up query.
	 */
	_cleanCriteria(criterion) {
		const test = criterion
			.filter(({items}) => (items ? items.length : true))
			.map(item =>
				item.items
					? Object.assign(item, {
						items: this._cleanCriteria(item.items)
					  })
					: item
			);

		return test;
	}

	_handleToggleEdit = () => {
		this.setState({
			editing: !this.state.editing
		});
	};

	/**
	 * Updates the query state from changes made by the group and row
	 * components.
	 *
	 * @param {object} newCriteria
	 */
	_updateCriteria = newCriteria => {
		this.props.onChange(this._cleanCriteria([newCriteria]).pop());
	};
}

const QUERY_GROUP_SHAPE = {
	conjunctionId: PropTypes.string,
	items: PropTypes.array
};

const QUERY_ITEM_SHAPE = {
	propertyName: PropTypes.string,
	operatorName: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

ClayCriteriaBuilder.propTypes = {
	properties: PropTypes.arrayOf(
		PropTypes.shape({
			entityUrl: PropTypes.string,
			label: PropTypes.string,
			name: PropTypes.string.isRequired,
			options: PropTypes.array,
			type: PropTypes.string
		})
	).isRequired,
	conjunctions: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.string
		})
	),
	onChange: PropTypes.func,
	operators: PropTypes.arrayOf(
		PropTypes.shape({
			supportedTypes: PropTypes.arrayOf(PropTypes.string),
			value: PropTypes.string
		})
	),
	criteria: PropTypes.shape({
		conjunctionId: PropTypes.string,
		items: PropTypes.arrayOf(
			PropTypes.oneOfType([
				PropTypes.shape(QUERY_GROUP_SHAPE),
				PropTypes.shape(QUERY_ITEM_SHAPE)
			])
		)
	}),
	maxNesting: PropTypes.number,
	readOnly: PropTypes.bool,
	spritemap: PropTypes.string
};

ClayCriteriaBuilder.defaultProps = {
	readOnly: false
};

export default ClayCriteriaBuilder;