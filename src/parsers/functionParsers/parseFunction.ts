import { FunctionNames, SQL } from "@/types";
import { toString } from "@/utils";

export const parseFunction = (
	type: FunctionNames,
	body: string,
	name?: string
): SQL => {
	const func = type.toUpperCase();
	const sql = `${func}(${body})`;

	return name ? toString([sql, name], " as ") : sql;
};
