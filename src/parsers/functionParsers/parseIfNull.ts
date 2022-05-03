import { AnyObject, IfNull, SQL } from "@/types";
import { toJSON, toString } from "@/utils";

export const parseIfNull = <TF extends AnyObject>(
	table: string,
	ifNull: IfNull<TF>
): SQL => {
	const type: string = ifNull.type.toUpperCase();
	const field: string = toString([table, ifNull.field], ".");
	const fallback: string = toString(toJSON([ifNull.no]));
	const name: string | undefined = ifNull.name;
	const sql: SQL = `${type}(${field}, ${fallback})`;
	return name ? toString([sql, name], " as ") : sql;
};
