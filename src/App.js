import ReactDOM from 'react-dom';
import ClayQueryBuilder from './ClayQueryBuilder'

export function initialize(props, id) {
    ReactDOM.render(
        <ClayQueryBuilder {...props} />,
        document.getElementById(id)
    )
}