import React, {Component, Fragment} from 'react';
import {PropTypes} from 'prop-types';
import CriteriaRow from './CriteriaRow.es';
import ClayButton from '../shared/ClayButton.es';
import {CONJUNCTIONS} from '../../utils/constants.es';
import DropZone from './DropZone.es';
import EmptyDropZone from './EmptyDropZone.es';
import getCN from 'classnames';
import {generateGroupId, insertAtIndex, replaceAtIndex} from '../../utils/utils.es';

class CriteriaGroup extends Component {
	static propTypes = {
		criteria: PropTypes.object,
		editing: PropTypes.bool,
		groupId: PropTypes.string,
		onChange: PropTypes.func,
		onMove: PropTypes.func,
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
			{
				...criteria,
				...{
					conjunctionName: conjunctionSelected
				}
			}
		);
	}

	/**
	 * Adds a new criterion in a group at the specified index. If the criteria
	 * was previously empty and is being added to the root group, a new group
	 * will be added as well.
	 * @param {number} index The position the criterion will be inserted in.
	 * @param {object} criterion The criterion that will be added.
	 * @memberof CriteriaGroup
	 */
	_handleCriterionAdd = (index, criterion) => {
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
					groupId: generateGroupId(),
					items: [newCriterion]
				}
			);
		}
		else {
			onChange(
				{
					...criteria,
					...{
						items: insertAtIndex(
							newCriterion,
							criteria.items,
							index
						)
					}
				}
			);
		}
	}

	_handleCriterionChange = index => newCriterion => {
		const {criteria, onChange} = this.props;

		onChange(
			{
				...criteria,
				...{
					items: replaceAtIndex(newCriterion, criteria.items, index)
				}
			}
		);
	}

	_handleCriterionDelete = index => {
		const {criteria, onChange} = this.props;

		onChange(
			{
				...criteria,
				...{
					items: criteria.items.filter(
						(fItem, fIndex) => fIndex !== index
					)
				}
			}
		);
	}

	_isCriteriaEmpty = () => {
		const {criteria} = this.props;

		return criteria ? !criteria.items.length : true;
	}

	_renderConjunction = index => {
		const {criteria, editing, groupId, onMove, supportedConjunctions} = this.props;

		return (
			<Fragment>
				<DropZone
					groupId={groupId}
					index={index}
					onCriterionAdd={this._handleCriterionAdd}
					onMove={onMove}
				/>

				{editing ?
					<ClayButton
						className="btn-sm conjunction-button"
						label={this._getConjunctionLabel(
							criteria.conjunctionName,
							supportedConjunctions
						)}
						onClick={this._handleConjunctionClick}
					/> :
					<div className="conjunction-label">
						{this._getConjunctionLabel(
							criteria.conjunctionName,
							supportedConjunctions
						)}
					</div>
				}

				<DropZone
					before
					groupId={groupId}
					index={index}
					onCriterionAdd={this._handleCriterionAdd}
					onMove={onMove}
				/>
			</Fragment>
		);
	}

	_renderCriterion = (criterion, index) => {
		const {
			editing,
			groupId,
			onMove,
			root,
			supportedConjunctions,
			supportedOperators,
			supportedProperties,
			supportedPropertyTypes
		} = this.props;

		const classes = getCN(
			'criterion',
			{
				'criterion-group': criterion.items
			}
		);

		return (
			<div className={classes}>
				{criterion.items ? (
					<CriteriaGroup
						criteria={criterion}
						editing={editing}
						groupId={criterion.groupId}
						onChange={this._handleCriterionChange(index)}
						onMove={onMove}
						supportedConjunctions={supportedConjunctions}
						supportedOperators={supportedOperators}
						supportedProperties={supportedProperties}
						supportedPropertyTypes={supportedPropertyTypes}
					/>
				) : (
					<CriteriaRow
						criterion={criterion}
						editing={editing}
						groupId={groupId}
						index={index}
						onChange={this._handleCriterionChange(index)}
						onDelete={this._handleCriterionDelete}
						onMove={onMove}
						root={root}
						supportedConjunctions={supportedConjunctions}
						supportedOperators={supportedOperators}
						supportedProperties={supportedProperties}
						supportedPropertyTypes={supportedPropertyTypes}
					/>
				)}

				<DropZone
					groupId={groupId}
					index={index + 1}
					onCriterionAdd={this._handleCriterionAdd}
					onMove={onMove}
				/>
			</div>
		);
	}

	render() {
		const {
			criteria,
			groupId,
			onMove,
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
						onCriterionAdd={this._handleCriterionAdd}
					/> :
					<Fragment>
						<DropZone
							before
							groupId={groupId}
							index={0}
							onCriterionAdd={this._handleCriterionAdd}
							onMove={onMove}
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