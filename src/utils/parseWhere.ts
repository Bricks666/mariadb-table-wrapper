import { parseSQLValues, toString } from ".";
import { RequestValues, SQL } from "../types";

export const parseWhere = <T extends object>(object: T): SQL => {
	const keys: string[] = Object.keys(object);
	const values: RequestValues[] = Object.values(object);

	const filtersArray: SQL[] = keys.map((key, i) => {
		let filter: SQL = `${key} `;

		if (Array.isArray(values[i])) {
			filter += `IN (${parseSQLValues(values[i] as Array<unknown>)})`;
		} else {
			filter += `= "${values[i]}"`;
		}

		return filter;
	});

	return `WHERE ${toString(filtersArray, " AND ")}`;
};
