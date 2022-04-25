import {
	AnyObject,
	Expressions,
	SQL,
	TableFilters,
	ValidSQLType,
} from "@/types";
import { addPrefix, toString, isArray } from "@/utils";
import { parseExpressions } from "../tableParsers";

export const parseWhere = <T extends AnyObject>(
	tableName: string,
	filters: TableFilters<T> | TableFilters<T>[]
): SQL => {
	const SQLFilters: SQL[] = [];
	if (isArray(filters)) {
		filters.forEach((filter) => {
			SQLFilters.push(parseFilter(tableName, filter));
		});
	} else {
		SQLFilters.push(parseFilter(tableName, filters));
	}

	return `WHERE ${toString(SQLFilters, " OR ")}`;
};

const parseFilter = <T extends AnyObject>(
	tableName: string,
	filter: TableFilters<T>
) => {
	const keys = Object.keys(filter);

	const conditions: SQL[] = keys.map((key) =>
		parseExpressions(
			addPrefix(key, tableName),
			filter[key] as Expressions<ValidSQLType>
		)
	);
	return toString(conditions, " AND ");
};
