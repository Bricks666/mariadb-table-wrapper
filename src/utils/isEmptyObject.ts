export const isEmptyObject = (obj: object): boolean => {
	return Object.getOwnPropertyNames(obj).length === 0;
};
