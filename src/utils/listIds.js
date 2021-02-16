export const listIds = (list, propertyName) => {
	propertyName = propertyName || "id";
	const ids = [];
	if (list) {
		for (const item of list) {
			ids.push(item[propertyName]);
		}
	}
	return ids;
};
