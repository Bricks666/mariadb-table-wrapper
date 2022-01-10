import { addPrefix, toString } from "..";
import { AnyObject, ExcludeFields, SQL } from "../../types";

export const parseExcludes = <T extends AnyObject>(
	tableName: string,
	tableFields: string[],
	excludes: ExcludeFields<T>
): SQL => {
	const excludesWithPrefix = addPrefix(excludes as string[], tableName, ".");
	const goodFields = Object.values(tableFields).filter(
		(filed) => !excludesWithPrefix.includes(filed)
	);
	return toString(goodFields, ", ");
};
