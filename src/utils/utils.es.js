import uniqueId from 'lodash.uniqueid';

const GROUP_ID_NAMESPACE = 'group_';

export function generateGroupId() {
	return uniqueId(GROUP_ID_NAMESPACE);
}

export function insertAtIndex(item, list, index) {
	return [...list.slice(0, index), item, ...list.slice(index, list.length)];
}

export function replaceAtIndex(item, list, index) {
	return Object.assign(
		list,
		{
			[index]: item
		}
	);
}