import { parseAs } from ".";
import { addPrefix, isArray, toString } from "..";
import { AnyObject, IncludeFields, SQL } from "../../types";

export const parseIncludes = <T extends AnyObject>(
	tableName: string,
	includes: IncludeFields<T>
): SQL => {
	const fields: string[] = [];

	if (isArray(includes)) {
		includes.forEach((el) => {
			const field = isArray(el) ? parseAs(el) : el.toString();
			fields.push(addPrefix(field, tableName));
		});
	} else {
		const pairs = Object.entries(includes);
		pairs.forEach((pair) => {
			fields.push(parseIncludes(pair[0], pair[1]));
		});
	}

	return toString(fields, ", ");
};
