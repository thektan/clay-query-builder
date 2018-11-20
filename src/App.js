import React from 'react';
import ReactDOM from 'react-dom';
import ClayODataQueryBuilder from './ClayODataQueryBuilder';
import ThemeContext from './ThemeContext';

export function initialize(props, id, context) {
	ReactDOM.render(
		<ThemeContext.Provider value={context}>
			<ClayODataQueryBuilder {...props} />
		</ThemeContext.Provider>,
		document.getElementById(id)
	);
}