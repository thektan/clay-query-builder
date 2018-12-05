import React, {Component} from 'react';
import {PropTypes} from 'prop-types';

class ClaySelect extends Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		options: PropTypes.array.isRequired,
		selected: PropTypes.string
	};

	render() {
		const {className, options, selected, ...otherProps} = this.props;

		return (
			<select
				className={`form-control ${className}`}
				{...otherProps}
				value={selected}
			>
				{options.map(
					(option, index) => (
						<option key={index} value={option.value}>
							{option.label}
						</option>
					)
				)}
			</select>
		);
	}
}

export default ClaySelect;