import { toString } from "../../utils";

export const parseSQLKeys = <T extends object>(object: T): string => {
	return toString(Object.keys(object));
};
