import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CriteriaSidebarItem from './CriteriaSidebarItem.es';

class CriteriaSidebar extends Component {
	static propTypes = {
		supportedProperties: PropTypes.array,
		title: PropTypes.string
	};

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
							<CriteriaSidebarItem
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

export default CriteriaSidebar;