import React from 'react';
import ReactDOM from 'react-dom';
import ODataQueryBuilder from './components/odata_query_builder/ODataQueryBuilder.es';
import ThemeContext from './ThemeContext.es';

import './utils/language';
import './css/main.scss';

export function initialize(id, props, context) {
	ReactDOM.render(
		<ThemeContext.Provider value={context}>
			<ODataQueryBuilder {...props} />
		</ThemeContext.Provider>,
		document.getElementById(id)
	);
}