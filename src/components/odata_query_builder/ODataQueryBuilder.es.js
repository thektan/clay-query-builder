import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CriteriaBuilder from '../criteria_builder/CriteriaBuilder.es';
import {buildQueryString, translateQueryToCriteria} from '../../utils/odata.es';
import {CONJUNCTIONS, RELATIONAL_OPERATORS} from '../../utils/constants.es';
import '../../libs/odata-parser.js';

import {Liferay} from '../../utils/language';

const {AND, OR} = CONJUNCTIONS;
const {EQ, GE, GT, LE, LT, NE} = RELATIONAL_OPERATORS;

const SUPPORTED_CONJUNCTIONS = [
	{
		label: Liferay.Language.get('and'),
		name: AND
	},
	{
		label: Liferay.Language.get('or'),
		name: OR
	}
];

const SUPPORTED_OPERATORS = [
	{
		label: Liferay.Language.get('equals'),
		name: EQ
	},
	{
		label: Liferay.Language.get('greater-than-or-equals'),
		name: GE
	},
	{
		label: Liferay.Language.get('greater-than'),
		name: GT
	},
	{
		label: Liferay.Language.get('less-than-or-equals'),
		name: LE
	},
	{
		label: Liferay.Language.get('less-than'),
		name: LT
	},
	{
		label: Liferay.Language.get('not-equals'),
		name: NE
	}
];

const SUPPORTED_PROPERTY_TYPES = {
	BOOLEAN: [EQ, NE],
	DATE: [EQ, GE, GT, LE, LT, NE],
	NUMBER: [EQ, GE, GT, LE, LT, NE],
	STRING: [EQ, NE]
};

class ODataQueryBuilder extends Component {
	static propTypes = {
		initialQuery: PropTypes.string,
		inputId: PropTypes.string,
		operators: PropTypes.array,
		properties: PropTypes.array
	};

	constructor(props) {
		super(props);

		const {initialQuery} = props;

		this.state = {
			criteriaMap: initialQuery && initialQuery !== '()' ?
				translateQueryToCriteria(initialQuery) :
				null,
			query: initialQuery
		};
	}

	_handleChange = newCriteriaMap => {
		this.setState(
			{
				criteriaMap: newCriteriaMap,
				query: buildQueryString([newCriteriaMap])
			}
		);
	};

	render() {
		const {inputId, properties} = this.props;

		const {criteriaMap} = this.state;

		return (
			<div className="clay-query-builder-root">
				<div className="form-group">
					<CriteriaBuilder
						criteria={criteriaMap}
						onChange={this._handleChange}
						supportedConjunctions={SUPPORTED_CONJUNCTIONS}
						supportedOperators={SUPPORTED_OPERATORS}
						supportedProperties={properties}
						supportedPropertyTypes={SUPPORTED_PROPERTY_TYPES}
					/>
				</div>

				<div className="form-group">
					<textarea
						className="field form-control"
						id={inputId}
						name={inputId}
						readOnly
						value={criteriaMap ? buildQueryString([criteriaMap]) : ''}
					/>
				</div>
			</div>
		);
	}
}

export default ODataQueryBuilder;