import React from 'react';
import {PropTypes} from 'prop-types';
import ClayIcon from '../clay_icon/ClayIcon';
import './ClayButton.scss';

class ClayButton extends React.Component {
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
	iconName: PropTypes.string,
	label: PropTypes.string,
	type: PropTypes.string
};

export default ClayButton;