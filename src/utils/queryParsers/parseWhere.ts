import { AnyObject, Check, SQL, TableFilters, ValidSQLType } from "@/types";
import { addPrefix, toString } from "@/utils";
import { parseCheck } from "../tableParsers";

export const parseWhere = <T extends AnyObject>(
	tableName: string,
	filters: TableFilters<T>
): SQL => {
	const keys = Object.keys(filters);

	const conditions: SQL[] = keys.map((key) =>
		parseCheck(addPrefix(key, tableName), filters[key] as Check<ValidSQLType>)
	);
	const where: SQL = toString(conditions, " AND ");

	return `WHERE ${where}`;
};
