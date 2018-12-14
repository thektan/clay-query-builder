import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import getCN from 'classnames';

class ClaySelect extends Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		options: PropTypes.arrayOf(
			PropTypes.shape(
				{
					label: PropTypes.string,
					value: PropTypes.string.isRequired
				}
			)
		).isRequired,
		selected: PropTypes.string
	};

	render() {
		const {className, options, selected, ...otherProps} = this.props;

		const classes = getCN(
			'form-control',
			className
		);

		return (
			<select
				className={classes}
				{...otherProps}
				value={selected}
			>
				{options.map(
					({label, value}, index) => (
						<option key={index} value={value}>
							{label ? label : value}
						</option>
					)
				)}
			</select>
		);
	}
}

export default ClaySelect;