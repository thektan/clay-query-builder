import React from 'react';
import {PropTypes} from 'prop-types';
import ClayButton from '../clay_button/ClayButton';
import ClaySelect from '../clay_select/ClaySelect';
import CriteriaGroup from './CriteriaGroup';
import './CriteriaRow.scss';

class CriteriaRow extends React.Component {
	static defaultProps = {
		editing: true,
		root: false
	};

	static propTypes = {
		criterion: PropTypes.object,
		editing: PropTypes.bool,
		onChange: PropTypes.func,
		properties: PropTypes.array,
		root: PropTypes.bool,
		supportedConjunctions: PropTypes.array,
		supportedOperators: PropTypes.array,
		supportedPropertyTypes: PropTypes.object
	};

	static _getSelectedItem(list, idSelected) {
		return list.find(item => item.name === idSelected);
	}

	constructor(props) {
		super(props);

		const {criterion, root} = props;

		if (root && !criterion.items) {
			this._createPlaceholderGroup(criterion);
		}

		this._handleInputChange = this._handleInputChange.bind(this);
		this._handleCriteriaChange = this._handleCriteriaChange.bind(this);
		this._handleDeleteButtonClick = this._handleDeleteButtonClick.bind(this);
	}

	_createPlaceholderGroup = criterion => {
		const {onChange, supportedConjunctions} = this.props;

		onChange(
			{
				conjunctionName: supportedConjunctions[0].name,
				items: [Object.assign({}, criterion)]
			}
		);
	}

	_handleCriteriaChange = newCriteria => {
		const {criterion, onChange} = this.props;

		onChange(Object.assign(criterion, newCriteria));
	};

	_handleDeleteButtonClick() {
		const {onChange} = this.props;

		onChange();
	}

	_handleInputChange = propertyName => event => {
		this._handleCriteriaChange({[propertyName]: event.target.value});
	};

	render() {
		const {
			criterion,
			editing,
			properties,
			supportedConjunctions,
			supportedOperators,
			supportedPropertyTypes
		} = this.props;

		const selectedProperty = CriteriaRow._getSelectedItem(
			properties,
			criterion.propertyName
		);

		const selectedOperator = CriteriaRow._getSelectedItem(
			supportedOperators,
			criterion.operatorName
		);

		return (
			<div styleName="criterion-container">
				{criterion.items ? (
					<CriteriaGroup
						criteria={criterion}
						editing={editing}
						onChange={this._handleCriteriaChange}
						properties={properties}
						supportedConjunctions={supportedConjunctions}
						supportedOperators={supportedOperators}
						supportedPropertyTypes={supportedPropertyTypes}
					/>
				) : (
					<div
						styleName={`criterion-row ${editing ? 'editing' : ''}`}
					>
						{editing ? (
							<div styleName="edit-container">
								<ClaySelect
									className="form-control"
									key="property"
									onChange={this._handleInputChange(
										'propertyName'
									)}
									options={properties.map(
										({label, name}) => ({
											label,
											value: name
										})
									)}
									selected={selectedProperty.name}
									styleName="criterion-input"
								/>

								<ClaySelect
									className="form-control"
									key="operator"
									onChange={this._handleInputChange(
										'operatorName'
									)}
									options={supportedOperators.map(
										({label, name}) => ({
											label,
											value: name
										})
									)}
									selected={selectedOperator.name}
									styleName="criterion-input operator-input"
								/>

								<input
									className="form-control"
									id="queryRowValue"
									key="value"
									onChange={this._handleInputChange('value')}
									styleName="criterion-input"
									type="text"
									value={criterion.value}
								/>

								<ClayButton
									className="btn-monospaced"
									iconName="trash"
									key="delete"
									onClick={this._handleDeleteButtonClick}
									styleName="delete-button"
								/>
							</div>
						) : (
							<div styleName="read-only-container">
								<span styleName="criteria-string">
									{'Property '}
									<strong styleName="property-string">
										{`${selectedProperty.label} `}
									</strong>

									{`${selectedOperator.label} `}

									<strong styleName="value-string">
										{`${criterion.value}.`}
									</strong>
								</span>
							</div>
						)}
					</div>
				)}
			</div>
		);
	}
}

export default CriteriaRow;