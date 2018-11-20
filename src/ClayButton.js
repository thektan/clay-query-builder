import React from 'react';
import {PropTypes} from 'prop-types';
import ClayIcon from './ClayIcon';

class ClayButton extends React.Component {
	render() {
		const {label, icon, spritemap} = this.props;

		return (
			<button
				className={`btn btn-secondary ${
					icon && spritemap ? 'btn-monospaced' : ''
				}`}
			>
				{icon && spritemap ? (
					<ClayIcon spritemap={spritemap} symbol={icon} />
				) : (
					label
				)}
			</button>
		);
	}
}

ClayButton.propTypes = {
	icon: PropTypes.string,
	label: PropTypes.string,
	spritemap: PropTypes.string,
	type: PropTypes.string
};

export default ClayButton;