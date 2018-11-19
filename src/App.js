import React from 'react';
import ReactDOM from 'react-dom';
import ClayODataQueryBuilder from './ClayODataQueryBuilder'

export function initialize(props, id) {
    ReactDOM.render(
        <ClayODataQueryBuilder 
            {...props} 
        />,
        document.getElementById(id)
    )
}