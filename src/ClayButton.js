import React from 'react';
import {PropTypes} from 'prop-types';
import ClayIcon from './ClayIcon';
import './css/ClayButton.scss';

class ClayButton extends React.Component {
	render() {
		const {className, label, iconName, ...otherProps} = this.props;

		return (
			<button
				className={`btn btn-secondary ${className}`}
				{...otherProps}
			>
				{label}

				{iconName && (
					<ClayIcon
						iconName={iconName}
						styleName={`${label ? 'text-icon' : 'icon'}`}
					/>
				)}
			</button>
		);
	}
}

ClayButton.propTypes = {
	className: PropTypes.string,
	label: PropTypes.string,
	type: PropTypes.string,
	iconName: PropTypes.string
};

export default ClayButton;