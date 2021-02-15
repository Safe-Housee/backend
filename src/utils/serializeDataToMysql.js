export function serializeData(data) {
	return data.split("/").reverse().join("-");
}
