import { toString } from ".";
import { AnyObject, Fields, SQL } from "../types";

export const parseExcludes = <T extends AnyObject>(
	tableFields: Fields<T>,
	excludes: (keyof T)[]
): SQL => {
	const goodFields = Object.keys(tableFields).filter(
		(filed) => !excludes.includes(filed)
	);
	return toString(goodFields, ", ");
};
