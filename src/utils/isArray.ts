export const isArray = <T extends Array<unknown>>(
	param: unknown
): param is T => {
	return Array.isArray(param);
};
