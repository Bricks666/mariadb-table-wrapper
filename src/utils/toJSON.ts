export const toJSON = (values: string[]): string[] => {
	return values.filter((s) => s !== "").map((el: string) => JSON.stringify(el));
};
