export const inStatement = (list) => {
	if (!list) return "";
	let inStatement = "in (";
	for (let index = 1; index <= list.length; index++) {
		inStatement += `?,`;
	}
	inStatement = inStatement.substring(0, inStatement.length - 1);
	return `${inStatement})`;
};
