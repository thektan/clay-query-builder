import React from 'react';
import {PropTypes} from 'prop-types';

class ClayButton extends React.Component {
	render() {
		const {label} = this.props;

		return (
			<button className="btn btn-secondary" {...this.props}>
				{label}
			</button>
		);
	}
}

ClayButton.propTypes = {
	label: PropTypes.string,
	type: PropTypes.string
};

export default ClayButton;