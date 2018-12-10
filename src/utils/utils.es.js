import uniqueId from 'lodash.uniqueid';

const GROUP_ID_NAMESPACE = 'group_';

const SPLIT_REGEX = /({\d+})/g;

/**
 * Generates a unique group id.
 * @returns {string} The unique id.
 */
export function generateGroupId() {
	return uniqueId(GROUP_ID_NAMESPACE);
}

/**
 * Inserts an item into a list at the specified index.
 * @param {*} item The item that will be inserted.
 * @param {Array} list The list where the item will be inserted into.
 * @param {number} index The position where the item will be inserted.
 * @returns {Array}
 */
export function insertAtIndex(item, list, index) {
	return [...list.slice(0, index), item, ...list.slice(index, list.length)];
}

/**
 * Removes an item at the specified index.
 * @param {Array} list The list the where an item will be removed.
 * @param {number} index The position where the item will be removed.
 * @returns {Array}
 */
export function removeAtIndex(list, index) {
	return list.filter(
		(fItem, fIndex) => fIndex !== index
	);
}

/**
 * Replaces an item in a list at the specified index.
 * @param {*} item The item that will be added.
 * @param {Array} list The list where an item will be replaced.
 * @param {number} index The position where the item will be replaced.
 * @returns {Array}
 */
export function replaceAtIndex(item, list, index) {
	return Object.assign(
		list,
		{
			[index]: item
		}
	);
}

/**
 * Utility function for substituting variables into language keys.
 *
 * Examples:
 * sub(Liferay.Language.get('search-x'), ['all'])
 * => 'search all'
 * sub(Liferay.Language.get('search-x'), [<b>all<b>], false)
 * => 'search <b>all</b>'
 *
 * @param {string} langKey This is the language key used from our properties file
 * @param {string} args Arguments to pass into language key
 * @param {string} join Boolean used to indicate whether to call `.join()` on
 * the array before it is returned. Use `false` if subbing in JSX.
 * @returns {(string|Array)}
 */
export function sub(langKey, args, join = true) {
	const keyArray = langKey.split(SPLIT_REGEX).filter(val => val.length !== 0);

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];

		const indexKey = `{${i}}`;

		let argIndex = keyArray.indexOf(indexKey);

		while (argIndex >= 0) {
			keyArray.splice(argIndex, 1, arg);

			argIndex = keyArray.indexOf(indexKey);
		}
	}

	return join ? keyArray.join('') : keyArray;
}