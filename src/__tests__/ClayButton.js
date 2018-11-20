import React from 'react';
import ClayButton from '../ClayButton';
import renderer from 'react-test-renderer';

describe('ClayButton', () => {
	it('should render', () => {
		const component = renderer.create(<ClayButton label="test" />);

		let tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});
});