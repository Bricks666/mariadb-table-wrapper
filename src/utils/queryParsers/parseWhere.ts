import { parseSQLValues } from ".";
import { addPrefix, isArray, toString } from "..";
import { AnyObject, SQL, TableFilter } from "../../types";

export const parseWhere = <T extends AnyObject>(
	filters: TableFilter<T>,
	tableName?: string
): SQL => {
	debugger;
	const keys = Object.keys(filters);
	const values = Object.values(filters);

	const filtersArray: SQL[] = keys.map((key, i) => {
		const validKey = tableName ? addPrefix([key], tableName, ".") : key;
		let filter: SQL = `${validKey} `;

		if (isArray(values[i])) {
			filter += `IN (${parseSQLValues(values[i])})`;
		} else {
			filter += `= ${values[i]}`;
		}

		return filter;
	});

	return `WHERE ${toString(filtersArray, " AND ")}`;
};
