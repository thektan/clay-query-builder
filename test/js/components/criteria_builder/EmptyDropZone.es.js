import React from 'react';
import EmptyDropZone from 'components/criteria_builder/EmptyDropZone.es';
import {cleanup, render} from 'react-testing-library';

const connectDnd = jest.fn(el => el);

describe(
	'EmptyDropZone',
	() => {
		afterEach(cleanup);

		it(
			'should render',
			() => {
				const OriginalEmptyDropZone = EmptyDropZone.DecoratedComponent;

				const {asFragment} = render(
					<OriginalEmptyDropZone
						connectDropTarget={connectDnd}
						onCriterionAdd={jest.fn()}
					/>
				);

				expect(asFragment()).toMatchSnapshot();
			}
		);
	}
);