export function serializeData(data) {
	const date = new Date(data);
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
