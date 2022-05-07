import { AnyObject, IfNull, SQL } from "@/types";
import { fullField, toJSON, toString } from "@/utils";
import { parseFunction } from "./parseFunction";

export const parseIfNull = <TF extends AnyObject>(
	table: string,
	func: IfNull<TF>
): SQL => {
	const field: string = fullField(table, func.field as string);
	const fallback: string = toString([toJSON(func.no)]);
	const body = toString([field, fallback]);
	return parseFunction(func.type, body, func.name);
};
