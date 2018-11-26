import autobind from 'autobind-decorator';
import React from 'react';
import PropTypes from 'prop-types';
import CriteriaBuilder from './CriteriaBuilder';
import {
	buildQueryString,
	SUPPORTED_CONJUNCTIONS,
	SUPPORTED_OPERATORS,
	SUPPORTED_PROPERTY_TYPE_OPERATORS,
	translateToCriteria
} from './util/odata-paraser';

class ODataQueryBuilder extends React.Component {
	static propTypes = {
		initialQuery: PropTypes.string,
		maxNesting: PropTypes.number,
		operators: PropTypes.array,
		properties: PropTypes.array,
		query: PropTypes.string,
		readOnly: PropTypes.bool
	}

	constructor(props) {
		super(props);

		const {query} = props;

		this.state = {
			criteria: query ? translateToCriteria(query) : null,
			initialQuery: query,
			query
		};
	}

	render() {
		const {maxNesting, properties, readOnly} = this.props;

		const {criteria} = this.state;

		return (
			<div>
				<ClayCriteriaBuilder
					conjunctions={SUPPORTED_CONJUNCTIONS}
					criteria={criteria}
					maxNesting={maxNesting}
					onChange={this._updateQuery}
					operators={SUPPORTED_OPERATORS}
					properties={properties}
					propertyTypes={SUPPORTED_PROPERTY_TYPE_OPERATORS}
					readOnly={readOnly}
				/>

				<span>{criteria && buildQueryString([criteria])}</span>
			</div>
		);
	}

	/**
	 * Updates the oData query in the state to match any criteria changes.
	 * @memberof ClayODataQueryBuilder
	 */
	@autobind
	_updateQuery(newCriteria) {
		this.setState(
			{
				criteria: newCriteria,
				query: buildQueryString([newCriteria])
			}
		);
	};
}

export default ODataQueryBuilder;