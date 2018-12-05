import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import ClayIcon from './ClayIcon.es';

class ClayButton extends Component {
	static propTypes = {
		className: PropTypes.string,
		iconName: PropTypes.string,
		label: PropTypes.string,
		type: PropTypes.string
	};

	render() {
		const {className, iconName, label, ...otherProps} = this.props;

		return (
			<button
				className={`btn btn-secondary ${className}`}
				{...otherProps}
			>
				{label}

				{iconName && (
					<ClayIcon
						className={`${label ? 'text-icon' : 'icon'}`}
						iconName={iconName}
					/>
				)}
			</button>
		);
	}
}

export default ClayButton;