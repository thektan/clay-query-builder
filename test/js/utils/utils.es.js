import * as Utils from 'utils/utils.es';
import {mockCriteria, mockCriteriaNested} from 'test/data';

describe(
	'utils',
	() => {
		describe(
			'getChildGroupIds',
			() => {
				it(
					'should return an empty array if there are no child groups',
					() => {
						expect(Utils.getChildGroupIds(mockCriteria(1)))
							.toEqual([]);
						expect(Utils.getChildGroupIds(mockCriteria(3)))
							.toEqual([]);
					}
				);

				it(
					'should return the child group ids',
					() => {
						expect(Utils.getChildGroupIds(mockCriteriaNested()))
							.toEqual(['group_02', 'group_03', 'group_04']);
					}
				);
			}
		);

		describe(
			'insertAtIndex',
			() => {
				it(
					'should insert an item at the beginning',
					() => {
						expect(Utils.insertAtIndex('c', ['a', 'b'], 0))
							.toEqual(['c', 'a', 'b']);
					}
				);

				it(
					'should insert an item at the middle',
					() => {
						expect(Utils.insertAtIndex('c', ['a', 'b'], 1))
							.toEqual(['a', 'c', 'b']);
					}
				);

				it(
					'should insert an item at the end',
					() => {
						expect(Utils.insertAtIndex('c', ['a', 'b'], 2))
							.toEqual(['a', 'b', 'c']);
					}
				);
			}
		);

		describe(
			'removeAtIndex',
			() => {
				it(
					'should remove the item at the beginning',
					() => {
						expect(Utils.removeAtIndex(['a', 'b', 'c'], 0))
							.toEqual(['b', 'c']);
					}
				);

				it(
					'should remove the item at the middle',
					() => {
						expect(Utils.removeAtIndex(['a', 'b', 'c'], 1))
							.toEqual(['a', 'c']);
					}
				);

				it(
					'should remove the item at the end',
					() => {
						expect(Utils.removeAtIndex(['a', 'b', 'c'], 2))
							.toEqual(['a', 'b']);
					}
				);
			}
		);

		describe(
			'replaceAtIndex',
			() => {
				it(
					'should replace the item at the beginning',
					() => {
						expect(Utils.replaceAtIndex('x', ['a', 'b', 'c'], 0))
							.toEqual(['x', 'b', 'c']);
					}
				);

				it(
					'should replace the item at the middle',
					() => {
						expect(Utils.replaceAtIndex('x', ['a', 'b', 'c'], 1))
							.toEqual(['a', 'x', 'c']);
					}
				);

				it(
					'should replace the item at the end',
					() => {
						expect(Utils.replaceAtIndex('x', ['a', 'b', 'c'], 2))
							.toEqual(['a', 'b', 'x']);
					}
				);
			}
		);

		describe('sub', () => {
			it('should return an array', () => {
				const res = Utils.sub('hello world', [''], false);

				expect(res).toEqual(['hello world']);
			});

			it('should return a string', () => {
				const res = Utils.sub('hello world', ['']);

				expect(res).toEqual('hello world');
			});

			it('should return with a subbed value for {0}', () => {
				const res = Utils.sub('hello {0}', ['world']);

				expect(res).toEqual('hello world');
			});

			it('should return with multiple subbed values', () => {
				const res = Utils.sub('My name is {0} {1}', ['hello', 'world']);

				expect(res).toEqual('My name is hello world');
			});
		});
	}
);