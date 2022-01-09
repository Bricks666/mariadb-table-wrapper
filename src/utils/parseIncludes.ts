import { toString } from ".";
import { AnyObject, SQL } from "../types";

export const parseIncludes = <T extends AnyObject>(
	includes: (keyof T)[]
): SQL => {
	return toString(includes, ", ");
};
