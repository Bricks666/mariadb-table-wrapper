import { addPrefix, isArray, toString } from "..";
import { AnyObject, ExcludeFields, SQL } from "../../types";

export const parseExcludes = <T extends AnyObject>(
	tableName: string,
	tableFields: string[],
	excludes: ExcludeFields<T>
): SQL => {
	const fields: string[] = [];
	if (isArray<string[]>(excludes)) {
		const excludesWithPrefix = excludes.map((exclude) =>
			addPrefix(exclude, tableName, ".")
		);

		const goodFields = Object.values(tableFields).filter(
			(filed) => !excludesWithPrefix.includes(filed)
		);

		fields.push(...goodFields);
	} else {
		const tableAndFields = Object.entries(excludes);

		tableAndFields.forEach(([table, excludeFields]) => {
			fields.push(parseExcludes(table, tableFields, excludeFields));
		});
	}

	return toString(fields, ", ");
};
