import { AnyObject, If, SQL } from "@/types";
import { fullField, toString } from "@/utils";
import { parseExpressions } from "../tableParsers";
import { parseFunction } from "./parseFunction";

export const parseIf = <TF extends AnyObject>(
	table: string,
	func: If<TF>
): SQL => {
	const field = fullField(table, func.field as string);
	const expression = parseExpressions(field, func.condition);
	const yes = func.yes === undefined ? field : func.yes;
	const no = func.no || null;
	const body = toString([expression, yes, no]);
	return parseFunction(func.type, body, func.name);
};
