import React from 'react';
import {PropTypes} from 'prop-types';
import ClayButton from '../clay_button/ClayButton';
import CriteriaRow from './CriteriaRow';
import './CriteriaGroup.scss';

function insertAtIndex(item, list, index) {
	return [...list.slice(0, index), item, ...list.slice(index, list.length)];
}

class CriteriaGroup extends React.Component {
	static defaultProps = {
		root: false
	};

	static propTypes = {
		criteria: PropTypes.object,
		editing: PropTypes.bool,
		onChange: PropTypes.func,
		properties: PropTypes.array,
		root: PropTypes.bool,
		supportedConjunctions: PropTypes.array,
		supportedOperators: PropTypes.array,
		supportedPropertyTypes: PropTypes.object
	};

	static getConjunctionLabel(conjunctionName, supportedConjunctions) {
		const conjunction = supportedConjunctions.find(
			({name}) => name === conjunctionName
		);

		return conjunction ? conjunction.label : undefined;
	}

	constructor(props) {
		super(props);

		this._handleAddCriteriaButtonClick = this._handleAddCriteriaButtonClick.bind(this);
		this._handleConjunctionButtonClick = this._handleConjunctionButtonClick.bind(this);
		this._handleCriteriaChange = this._handleCriteriaChange.bind(this);
	}

	_handleAddCriteriaButtonClick(index) {
		return () => {
			const {
				criteria,
				onChange,
				properties,
				supportedOperators
			} = this.props;

			const emptyItem = {
				operatorName: supportedOperators[0].name,
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
	};

	_handleConjunctionButtonClick() {
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

	_handleCriteriaChange(index) {
		return newCriterion => {
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
	};

	render() {
		const {
			criteria,
			editing,
			properties,
			root,
			supportedConjunctions,
			supportedOperators,
			supportedPropertyTypes
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
										label={CriteriaGroup.getConjunctionLabel(
											criteria.conjunctionName,
											supportedConjunctions
										)}
										onClick={this._handleConjunctionButtonClick}
										styleName="conjunction"
									/>
								)}

								<div styleName="criterion-row">
									<CriteriaRow
										criterion={criterion}
										editing={editing}
										onChange={this._handleCriteriaChange(index)}
										properties={properties}
										root={root}
										supportedConjunctions={supportedConjunctions}
										supportedOperators={supportedOperators}
										supportedPropertyTypes={supportedPropertyTypes}
									/>

									{editing &&
										<ClayButton
											className="btn-sm btn btn-secondary"
											iconName="plus"
											onClick={this._handleAddCriteriaButtonClick(index)}
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
}

export default CriteriaGroup;