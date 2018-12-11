import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import ClayIcon from './ClayIcon.es';
import getCN from 'classnames';

class ClayButton extends Component {
	static propTypes = {
		borderless: PropTypes.bool,
		className: PropTypes.string,
		iconName: PropTypes.string,
		label: PropTypes.string,
		monospaced: PropTypes.bool,
		style: PropTypes.oneOf(
			[
				'primary',
				'secondary',
				'info',
				'success',
				'warning',
				'danger',
				'dark',
				'light'
			]
		),
		type: PropTypes.string
	};

	static defaultProps = {
		borderless: false,
		monospaced: false,
		style: 'secondary'
	};

	render() {
		const {
			borderless,
			className,
			iconName,
			label,
			monospaced,
			style,
			type,
			...otherProps
		} = this.props;

		const stylePrefix = borderless ? 'btn-outline-' : 'btn-';

		const classes = getCN(
			'btn',
			`${stylePrefix}${style}`,
			{
				'btn-monospaced': monospaced,
				'btn-outline-borderless': borderless
			},
			className
		);

		return (
			<button
				className={classes}
				type={type}
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