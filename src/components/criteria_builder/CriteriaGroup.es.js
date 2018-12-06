import React, {Component, Fragment} from 'react';
import {PropTypes} from 'prop-types';
import CriteriaRow from './CriteriaRow.es';
import ClayButton from '../shared/ClayButton.es';
import {CONJUNCTIONS} from '../../utils/constants.es';
import DropZone from './DropZone.es';
import EmptyDropZone from './EmptyDropZone.es';
import getCN from 'classnames';

function insertAtIndex(item, list, index) {
	return [...list.slice(0, index), item, ...list.slice(index, list.length)];
}

class CriteriaGroup extends Component {
	static propTypes = {
		criteria: PropTypes.object,
		editing: PropTypes.bool,
		onChange: PropTypes.func,
		root: PropTypes.bool,
		supportedConjunctions: PropTypes.array,
		supportedOperators: PropTypes.array,
		supportedProperties: PropTypes.array,
		supportedPropertyTypes: PropTypes.object
	};

	static defaultProps = {
		root: false
	};

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
	 * @param {object} criterion The criterion that will be added.
	 * @memberof CriteriaGroup
	 */
	_handleAddCriterion = (index, criterion) => {
		const {criteria, onChange, root, supportedOperators} = this.props;

		const {operatorName, propertyName, value} = criterion;

		const newCriterion = {
			operatorName: operatorName ?
				operatorName :
				supportedOperators[0].name,
			propertyName,
			value: value ? value : ''
		};

		if (root && !criteria) {
			onChange(
				{
					conjunctionName: CONJUNCTIONS.AND,
					items: [newCriterion]
				}
			);
		}
		else {
			onChange(
				Object.assign(
					criteria,
					{
						items: insertAtIndex(
							newCriterion,
							criteria.items,
							index
						)
					}
				)
			);
		}
	}

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
	}

	_isCriteriaEmpty = () => {
		const {criteria} = this.props;

		return criteria ? !criteria.items.length : true;
	}

	_renderConjunction = index => {
		const {criteria, supportedConjunctions} = this.props;

		return (
			<Fragment>
				<DropZone
					index={index}
					onAddCriteria={this._handleAddCriterion}
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
					onAddCriteria={this._handleAddCriterion}
				/>
			</Fragment>
		);
	}

	_renderCriterion = (criterion, index) => {
		const {
			editing,
			root,
			supportedConjunctions,
			supportedOperators,
			supportedProperties,
			supportedPropertyTypes
		} = this.props;

		return (
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
						index={index}
						onChange={this._updateCriterion(index)}
						onDelete={this._handleCriterionDelete}
						root={root}
						supportedConjunctions={supportedConjunctions}
						supportedOperators={supportedOperators}
						supportedProperties={supportedProperties}
						supportedPropertyTypes={supportedPropertyTypes}
					/>
				)}

				<DropZone
					index={index + 1}
					onAddCriteria={this._handleAddCriterion}
				/>
			</div>
		);
	}

	_handleCriterionDelete = index => {
		const {criteria, onChange} = this.props;

		onChange(
			Object.assign(
				criteria,
				{
					items: criteria.items.filter(
						(fItem, fIndex) => fIndex !== index
					)
				}
			)
		);
	}

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
	}

	_updateCriteria = (index, criterion) => newCriteria => {
		this._updateCriterion(index)(Object.assign(criterion, newCriteria));
	}

	render() {
		const {
			criteria,
			root,
		} = this.props;

		const classes = getCN(
			'criteria-group-root',
			{
				'criteria-group-item': !root,
				'criteria-group-item-root': root
			}
		);

		return (
			<div
				className={classes}
			>
				{this._isCriteriaEmpty() ?
					<EmptyDropZone
						index={0}
						onAddCriteria={this._handleAddCriterion}
					/> :
					<Fragment>
						<DropZone
							before
							index={0}
							onAddCriteria={this._handleAddCriterion}
						/>

						{criteria.items && criteria.items.map(
							(criterion, index) => {
								return (
									<Fragment key={index}>
										{index !== 0 &&
											this._renderConjunction(index)}

										{this._renderCriterion(
											criterion,
											index
										)}
									</Fragment>
								);
							}
						)}
					</Fragment>
				}
			</div>
		);
	}
}

export default CriteriaGroup;