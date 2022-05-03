import { AnyObject, If, SQL } from "@/types";
import { toString } from "@/utils";
import { parseExpressions } from "../tableParsers";

export const parseIf = <TF extends AnyObject>(
	table: string,
	ifFunction: If<TF>
): SQL => {
	const field = toString([table, ifFunction.field], ".");
	const func = ifFunction.type.toUpperCase();
	const expression = parseExpressions(field, ifFunction.condition);
	const yes = ifFunction.yes === undefined ? field : ifFunction.yes;
	const no = ifFunction.no || null;

	const sql = `${func}(${expression}, ${yes}, ${no})`;

	return ifFunction.name ? toString([sql, ifFunction.name], " as ") : sql;
};
