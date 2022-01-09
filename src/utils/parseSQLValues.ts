import { toJSON, toString } from ".";

export const parseSQLValues = <T extends object>(object: T): string => {
	return toString(toJSON(Object.values(object)));
};
