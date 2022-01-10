export const toJSON = (values: (string | number)[]): string[] => {
	return values.filter((s) => s !== "").map((el) => JSON.stringify(el));
};
