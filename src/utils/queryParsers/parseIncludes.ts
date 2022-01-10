import { parseAs } from ".";
import { addPrefix, isArray, toString } from "..";
import { AnyObject, IncludeFields, SQL } from "../../types";

export const parseIncludes = <T extends AnyObject>(
	tableName: string,
	includes: IncludeFields<T>
): SQL => {
	const fields: string[] = includes.map((el) =>
		isArray(el) ? parseAs(el) : el.toString()
	);
	return toString(addPrefix(fields, tableName, "."), ", ");
};
