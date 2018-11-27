import React from 'react';
import ReactDOM from 'react-dom';
import ODataQueryBuilder from './odata_query_builder/ODataQueryBuilder';
import ThemeContext from './ThemeContext';

export function initialize(props, id, context) {
	ReactDOM.render(
		<ThemeContext.Provider value={context}>
			<ODataQueryBuilder {...props} />
		</ThemeContext.Provider>,
		document.getElementById(id)
	);
}