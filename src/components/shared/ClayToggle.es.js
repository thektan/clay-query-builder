import React from 'react';
import {PropTypes} from 'prop-types';
import ClayIcon from './ClayIcon.es';

class ClayToggle extends React.Component {
	render() {
		const {
			checked,
			iconOff,
			iconOn,
			label,
			onChange,
			...otherProps
		} = this.props;

		return (
			<label className="toggle-switch" {...otherProps}>
				<input
					checked={checked}
					className="toggle-switch-check"
					onChange={onChange}
					type="checkbox"
				/>

				<span aria-hidden="true" className="toggle-switch-bar">
					<span
						className="toggle-switch-handle"
						data-label-off={label}
						data-label-on={label}
					>
						{iconOff &&
							<span className="button-icon button-icon-off toggle-switch-icon">
								<ClayIcon iconName={iconOff} />
							</span>
						}

						{iconOn &&
							<span className="button-icon button-icon-on toggle-switch-icon">
								<ClayIcon iconName={iconOn} />
							</span>
						}
					</span>
				</span>
			</label>
		);
	}
}

ClayToggle.propTypes = {
	checked: PropTypes.bool,
	className: PropTypes.string,
	iconOff: PropTypes.string,
	iconOn: PropTypes.string,
	label: PropTypes.string,
	onChange: PropTypes.func
};

ClayToggle.defaultProps = {
	label: ''
};

export default ClayToggle;