export const toJSON = (values: (string | number)[]): string[] => {
	return values
		.filter((s) => Boolean(String(s)))
		.map((el) => JSON.stringify(el));
};
