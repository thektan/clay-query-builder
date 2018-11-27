import React from 'react';
import PropTypes from 'prop-types';
import CriteriaBuilder from '../criteria_builder/CriteriaBuilder';
import {
	buildQueryString,
	SUPPORTED_CONJUNCTIONS,
	SUPPORTED_OPERATORS,
	SUPPORTED_PROPERTY_TYPES,
	translateQueryToCriteria
} from './util/odata-paraser';

/**
 * Higher order component for the criteria builder which handles odata parsing
 * @class ODataQueryBuilder
 * @extends {React.Component}
 */

class ODataQueryBuilder extends React.Component {

	/**
	 * @inheritDoc
	 * @static
	 * @memberof CriteriaBuilder
	 */

	static propTypes = {
		initialQuery: PropTypes.string,
		operators: PropTypes.array,
		properties: PropTypes.array,
		query: PropTypes.string,
		readOnly: PropTypes.bool
	}

	/**
	 * @inheritDoc
	 * @memberof ODataQueryBuilder
	 */

	constructor(props) {
		super(props);

		const {query} = props;

		this.state = {
			criteria: query ? translateQueryToCriteria(query) : null,
			initialQuery: query,
			query
		};

		this._handleQueryChange = this._handleQueryChange.bind(this);
	}

	/**
	 * @inheritDoc
	 * @memberof ODataQueryBuilder
	 */

	render() {
		const {properties, readOnly} = this.props;

		const {criteria} = this.state;

		return (
			<div>
				<CriteriaBuilder
					criteria={criteria}
					onChange={this._handleQueryChange}
					properties={properties}
					readOnly={readOnly}
					supportedConjunctions={SUPPORTED_CONJUNCTIONS}
					supportedOperators={SUPPORTED_OPERATORS}
					supportedPropertyTypes={SUPPORTED_PROPERTY_TYPES}
				/>

				<span>{criteria && buildQueryString([criteria])}</span>
			</div>
		);
	}

	/**
	 * Updates the oData query in the state to match any criteria changes.
	 * @param {object} newCriteria
	 * @memberof ODataQueryBuilder
	 */

	_handleQueryChange(newCriteria) {
		this.setState(
			{
				criteria: newCriteria,
				query: buildQueryString([newCriteria])
			}
		);
	};
}

export default ODataQueryBuilder;