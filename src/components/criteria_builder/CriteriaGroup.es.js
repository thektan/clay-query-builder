import React, {Component, Fragment} from 'react';
import {PropTypes} from 'prop-types';
import CriteriaRow from './CriteriaRow.es';
import ClayButton from '../shared/ClayButton.es';
import DropZone from './DropZone.es';
import EmptyDropZone from './EmptyDropZone.es';

function insertAtIndex(item, list, index) {
	return [...list.slice(0, index), item, ...list.slice(index, list.length)];
}

class CriteriaGroup extends Component {
	render() {
		const {
			criteria,
			editing,
			root,
			supportedConjunctions,
			supportedOperators,
			supportedProperties,
			supportedPropertyTypes
		} = this.props;

		return (
			<div
				className={`criteria-group-root ${root ? 'criteria-group-item-root' : 'criteria-group-item'}`}
			>
				{this._isCriteriaEmpty() ?
					<EmptyDropZone
						index={0}
						onAddCriteria={this._handleAddCriteria}
					/> :
					<Fragment>
						<DropZone
							before
							index={0}
							onAddCriteria={this._handleAddCriteria}
						/>

						{criteria.items && criteria.items.map(
							(criterion, index) => {
								return (
									<Fragment key={index}>
										{index != 0 && (
											<Fragment>
												<DropZone
													index={index}
													onAddCriteria={this._handleAddCriteria}
												/>

												<ClayButton
													className="btn-sm btn btn-secondary conjunction"
													label={this._getConjunctionLabel(
														criteria.conjunctionName,
														supportedConjunctions
													)}
													onClick={this._handleConjunctionClick}
												/>

												<DropZone
													before
													index={index}
													onAddCriteria={this._handleAddCriteria}
												/>
											</Fragment>
										)}

										<div className="criterion">
											{criterion.items ? (
												<CriteriaGroup
													criteria={criterion}
													editing={editing}
													onChange={this._updateCriteria(index, criterion)}
													supportedConjunctions={supportedConjunctions}
													supportedOperators={supportedOperators}
													supportedProperties={supportedProperties}
													supportedPropertyTypes={supportedPropertyTypes}
												/>
											) : (
												<CriteriaRow
													criterion={criterion}
													editing={editing}
													onChange={this._updateCriterion(index)}
													root={root}
													supportedConjunctions={supportedConjunctions}
													supportedOperators={supportedOperators}
													supportedProperties={supportedProperties}
													supportedPropertyTypes={supportedPropertyTypes}
												/>
											)}

											<DropZone
												index={index + 1}
												onAddCriteria={this._handleAddCriteria}
											/>
										</div>
									</Fragment>
								);
							}
						)}
					</Fragment>
				}
			</div>
		);
	}

	_getConjunctionLabel(conjunctionName, conjunctions) {
		const conjunction = conjunctions.find(
			({name}) => name === conjunctionName
		);

		return conjunction ? conjunction.label : undefined;
	}

	/**
	 * Adds a new criterion in a group at the specified index. If the criteria
	 * was previously empty and is being added to the root group, a new group
	 * will be added as well.
	 * @param {number} index The position the criterion will be inserted in.
	 * @param {string} propertyName The property name that will be added.
	 * @memberof CriteriaGroup
	 */
	_handleAddCriteria = (index, propertyName) => {
		const {criteria, onChange, root, supportedOperators} = this.props;

		const newCriterion = {
			operatorName: supportedOperators[0].name,
			propertyName,
			value: ''
		};

		if (root && !criteria) {
			onChange(
				{
					conjunctionName: 'and',
					items: [newCriterion]
				}
			);
		}
		else {
			onChange(
				Object.assign(
					criteria,
					{
						items: insertAtIndex(newCriterion, criteria.items, index)
					}
				)
			);
		}
	};

	_handleConjunctionClick = event => {
		event.preventDefault();

		const {criteria, onChange, supportedConjunctions} = this.props;

		const index = supportedConjunctions.findIndex(
			item => item.name === criteria.conjunctionName
		);

		const conjunctionSelected = index === supportedConjunctions.length - 1 ?
			supportedConjunctions[0].name :
			supportedConjunctions[index + 1].name;

		onChange(
			Object.assign(
				criteria,
				{
					conjunctionName: conjunctionSelected
				}
			)
		);
	};

	_isCriteriaEmpty = () => {
		const {criteria} = this.props;

		return criteria ? !criteria.items.length : true;
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

	_updateCriteria = (index, criterion) => newCriteria => {
		this._updateCriterion(index)(Object.assign(criterion, newCriteria));
	};
}

CriteriaGroup.propTypes = {
	criteria: PropTypes.object,
	editing: PropTypes.bool,
	onChange: PropTypes.func,
	root: PropTypes.bool,
	supportedConjunctions: PropTypes.array,
	supportedOperators: PropTypes.array,
	supportedProperties: PropTypes.array,
	supportedPropertyTypes: PropTypes.object
};

CriteriaGroup.defaultProps = {
	root: false
};

export default CriteriaGroup;