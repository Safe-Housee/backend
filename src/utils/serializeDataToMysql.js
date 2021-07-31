export function serializeData(data) {
	let date;
	if (typeof data === "string") {
		date = new Date();
	} else {
		date = new Date(data);
	}
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
