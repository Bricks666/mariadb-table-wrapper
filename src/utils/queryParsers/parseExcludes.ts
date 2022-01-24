import { addPrefix, isArray, toString } from "..";
import { AnyObject, ExcludeFields, SQL } from "../../types";

const parseExclude = (excludes: string[], table: string): string[] => {
	return excludes.map((exclude) => addPrefix(exclude, table, "."));
};

export const parseExcludes = <T extends AnyObject>(
	tableName: string,
	tableFields: string[],
	excludes: ExcludeFields<T>
): SQL => {
	let excludesFields: string[] = [];

	if (isArray<string[]>(excludes)) {
		excludesFields = parseExclude(excludes, tableName);
	} else {
		const tableAndFields = Object.entries(excludes);
		tableAndFields.forEach(([table, fields]) =>
			// eslint-disable-next-line sonarjs/no-empty-collection
			excludesFields.concat(parseExclude(fields, table))
		);
	}

	const goodFields = Object.values(tableFields).filter(
		(filed) => !excludesFields.includes(filed)
	);

	return toString(goodFields, ", ");
};
