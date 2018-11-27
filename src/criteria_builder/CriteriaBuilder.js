import React from 'react';
import PropTypes from 'prop-types';
import ClayButton from '../clay_button/ClayButton';
import CriteriaGroup from './CriteriaGroup';
import './CriteriaBuilder.scss';

const CRITERIA_GROUP_SHAPE = {
	conjunctionId: PropTypes.string.isRequired,
	items: PropTypes.array
};

const CRITERION_SHAPE = {
	operatorName: PropTypes.string.isRequired,
	propertyName: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

/**
 * Root component for the criteria builder.
 * It keeps track of the criteria and any edits to the criteria callback to
 * this component.
 * @class CriteriaBuilder
 * @extends {React.Component}
 */

class CriteriaBuilder extends React.Component {

	/**
	 * @inheritDoc
	 * @static
	 * @memberof CriteriaBuilder
	 */

	static defaultProps = {
		readOnly: true
	};

	/**
	 * @inheritDoc
	 * @static
	 * @memberof CriteriaBuilder
	 */

	static propTypes = {

		/**
		 * List of mappeable fields being shown as options
		 * @default undefined
		 * @instance
		 * @memberof CriteriaBuilder
		 * @private
		 * @type {null|{
		 * 	conjunctionId: !string,
		 * 	items: Array<{
		 *  	{
		 * 			conjunctionId: !string,
		 * 			items: Array<{}>
		 * 		}|{
		 * 			operatorName: !string,
		 * 			propertyName: !string,
		 * 			value: string|Array<{}>
		 * 		}
		 * 	}>
		 * }}
		 */

		criteria: PropTypes.shape(
			{
				conjunctionId: PropTypes.string,
				items: PropTypes.arrayOf(
					PropTypes.oneOfType(
						[
							PropTypes.shape(CRITERIA_GROUP_SHAPE),
							PropTypes.shape(CRITERION_SHAPE)
						]
					)
				)
			}
		),

		/**
		 * Callback that executes when a change is made to the criteria
		 * @default () => ()
		 * @instance
		 * @memberof CriteriaBuilder
		 * @private
		 * @type {function}
		 */

		onChange: PropTypes.func,

		/**
		 * Boolean flag that determines if criteria builder is editable
		 * @default false
		 * @instance
		 * @memberof CriteriaBuilder
		 * @private
		 * @type {!boolean}
		 */

		readOnly: PropTypes.bool,

		/**
		 * List of supported conjunctions and their labels
		 * @default undefined
		 * @instance
		 * @memberof CriteriaBuilder
		 * @private
		 * @type {!{
		 *
		 * }}
		 */

		supportedConjunctions: PropTypes.arrayOf(
			PropTypes.shape(
				{
					label: PropTypes.string,
					name: PropTypes.string.isRequired
				}
			)
		),

		/**
		 * List of supported properties and their metadata
		 * @default undefined
		 * @instance
		 * @memberof CriteriaBuilder
		 * @private
		 * @type {!{
		 *
		 * }}
		 */

		supportedProperties: PropTypes.arrayOf(
			PropTypes.shape(
				{
					entityUrl: PropTypes.string,
					label: PropTypes.string,
					name: PropTypes.string.isRequired,
					options: PropTypes.array,
					type: PropTypes.string.isRequired
				}
			)
		).isRequired,

		/**
		 * List of supported property types and the
		 * available operators for each.
		 * @default undefined
		 * @instance
		 * @memberof CriteriaBuilder
		 * @private
		 * @type {!{
		 *
		 * }}
		 */

		supportedPropertyTypes: PropTypes.arrayOf(
			PropTypes.shape(
				{
					supportedTypes: PropTypes.arrayOf(PropTypes.string),
					value: PropTypes.string
				}
			)
		)
	};

	/**
	 *
	 * @static
	 * @param {*} criteria
	 * @returns Boolean of whether a criteria group is empty or not.
	 * @memberof CriteriaBuilder
	 */
	static isCriteriaEmpty(criteria) {
		return criteria && criteria.items ? criteria.items.length : false;
	}

	/**
	 * @inheritDoc
	 * @memberof CriteriaBuilder
	 */

	constructor(props) {
		super(props);

		this.state = {
			editing: false,
			initialCriteria: this.props.criteria
		};

		this._handleCriteriaChange = this._handleCriteriaChange.bind(this);
		this._handleEditButtonClick = this._handleEditButtonClick.bind(this);
		this._handleNewCriteriaAreaClick = this._handleNewCriteriaAreaClick.bind(this);
	}

	/**
	 * Callback that is passed to the criteria builder's children. It simply
	 * passes along a new value to whatever higher order component is
	 * processing the criteria.
	 * @param {*} newCriteria
	 * @memberof CriteriaBuilder
	 */

	_handleCriteriaChange(newCriteria) {
		this.props.onChange(newCriteria);
	};

	/**
	 * Callback for the edit button. Toggles the edit state.
	 * @memberof CriteriaBuilder
	 */

	_handleEditButtonClick() {
		this.setState(
			{
				editing: !this.state.editing
			}
		);
	};

	/**
	 * Callback for clicking an empty criteria builder to start editing.
	 * It createes a new empty criteria object with the first operator,
	 * property, and conjunction selected.
	 * @memberof CriteriaBuilder
	 */

	_handleNewCriteriaAreaClick() {
		const {onChange, operators, properties} = this.props;

		const emptyItem = {
			operatorName: operators[0].name,
			propertyName: properties[0].name,
			value: ''
		};

		onChange(
			{
				conjunctionName: 'and',
				items: [emptyItem]
			}
		);
	}

	/**
	 * @inheritDoc
	 * @memberof CriteriaBuilder
	 */

	render() {
		const {
			criteria,
			properties,
			supportedConjunctions,
			supportedOperators,
			supportedPropertyTypes
		} = this.props;

		const {editing} = this.state;

		return (
			<div styleName="criteria-builder">
				<div styleName="toolbar">
					<ClayButton
						label="Edit"
						onClick={this._handleEditButtonClick}
					/>
				</div>

				{CriteriaBuilder.isCriteriaEmpty(criteria) ? (
					<CriteriaGroup
						criteria={criteria}
						editing={editing}
						onChange={this._handleCriteriaChange}
						properties={properties}
						root
						supportedConjunctions={supportedConjunctions}
						supportedOperators={supportedOperators}
						supportedPropertyTypes={supportedPropertyTypes}
					/>
				) : (
					<div
						onClick={this._handleNewCriteriaAreaClick}
						styleName="empty-state"
					>
						{'Click to start editing'}
					</div>
				)}
			</div>
		);
	}
}

export default CriteriaBuilder;