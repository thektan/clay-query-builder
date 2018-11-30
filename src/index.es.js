import React from 'react';
import ReactDOM from 'react-dom';
import ClayODataQueryBuilder from './ClayODataQueryBuilder.es';
import ThemeContext from './ThemeContext.es';
import './utils/language';
import './css/main.scss';

export function initialize(id, props, context) {
	ReactDOM.render(
		<ThemeContext.Provider value={context}>
			<ClayODataQueryBuilder {...props} />
		</ThemeContext.Provider>,
		document.getElementById(id)
	);
}