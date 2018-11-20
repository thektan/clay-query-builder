import React from 'react';
import PropTypes from 'prop-types';

const ClayIcon = ({spritemap, symbol}) => (
	<svg className={`lexicon-icon lexicon-icon-${symbol}`}>
		<use xlinkHref={`${spritemap}#${symbol}`} />
	</svg>
);

ClayIcon.propTypes = {
	spritemap: PropTypes.string,
	symbol: PropTypes.string
};

export default ClayIcon;