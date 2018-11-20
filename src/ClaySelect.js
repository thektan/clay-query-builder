import React from 'react';
import {PropTypes} from 'prop-types';

class ClaySelect extends React.Component {
	render() {
		const {selected, options, className, ...otherProps} = this.props;

		return (
			<select
				className={`form-control ${className}`}
				{...otherProps}
				value={selected}
			>
				{options.map((option, index) => (
					<option key={index} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		);
	}
}

ClaySelect.propTypes = {
	selected: PropTypes.string,
	options: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired
};

export default ClaySelect;