import React from 'react';
import {PropTypes} from 'prop-types';
import ClayCriteriaRow from './ClayCriteriaRow';
import ClayButton from './ClayButton';
import './css/ClayCriteriaGroup.scss';

const ID_PREFIX = 'group_';

let groupId = 0;

function generateId() {
	return ID_PREFIX + groupId++;
}

function insertAtIndex(item, list, index) {
	return [...list.slice(0, index), item, ...list.slice(index, list.length)];
}

class ClayCriteriaGroup extends React.Component {
	constructor(props) {
		super(props);

		this.groupId = generateId();
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
				{criteria.items && criteria.items.map(
					(criterion, index) => {
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
										onChange={this._updateCriterion(index)}
										operators={operators}
										properties={properties}
										root={root}
									/>

									{editing &&
										<ClayButton
											className="btn-sm btn btn-secondary"
											iconName="plus"
											onClick={this._handleAddCriteria(index)}
											styleName="add"
										/>
									}
								</div>
							</div>
						);
					}
				)}
			</div>
		);
	}

	_getConjunctionLabel(conjunctionName, conjunctions) {
		const conjunction = conjunctions.find(
			({name}) => name === conjunctionName
		);

		return conjunction ? conjunction.label : undefined;
	}

	_handleAddCriteria = index => () => {
		const {criteria, onChange, operators, properties} = this.props;

		const emptyItem = {
			operatorName: operators[0].name,
			propertyName: properties[0].name,
			value: ''
		};

		onChange(
			Object.assign(
				criteria,
				{
					items: insertAtIndex(emptyItem, criteria.items, index + 1)
				}
			)
		);
	};

	_handleConjunctionClick = () => {
		const {conjunctions, criteria, onChange} = this.props;

		const index = conjunctions.findIndex(
			item => item.name === criteria.conjunctionName
		);

		const conjunctionSelected = index === conjunctions.length - 1 ?
			conjunctions[0].name :
			conjunctions[index + 1].name;

		onChange(
			Object.assign(
				criteria,
				{
					conjunctionName: conjunctionSelected
				}
			)
		);
	};

	_updateCriterion = index => newCriterion => {
		const {criteria, onChange} = this.props;

		onChange(
			Object.assign(
				criteria,
				{
					items: newCriterion ?
						Object.assign(
							criteria.items,
							{
								[index]: newCriterion
							}
						) :
						criteria.items.filter(
							(fItem, fIndex) => fIndex !== index
						)
				}
			)
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