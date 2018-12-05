import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ClayCriteriaSidebarItem from './ClayCriteriaSidebarItem.es';

class ClayCriteriaSidebar extends Component {
	render() {
		const {supportedProperties, title} = this.props;

		return (
			<div className="criteria-sidebar-root">
				<div className="sidebar-header">
					{title}
				</div>

				<ul className="properties-list">
					{supportedProperties.map(
						({label, name, type}, index) => (
							<ClayCriteriaSidebarItem
								key={index}
								label={label}
								name={name}
								type={type}
							/>
						)
					)}
				</ul>
			</div>
		);
	}
}

ClayCriteriaSidebar.propTypes = {
	supportedProperties: PropTypes.array,
	title: PropTypes.string
};

export default ClayCriteriaSidebar;