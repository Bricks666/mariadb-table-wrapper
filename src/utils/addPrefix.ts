export const addPrefix = <T extends string>(
	array: T[],
	prefix: string,
	separator: string
): string[] => {
	return array.map((value) => `${prefix}${separator}${value}`);
};
