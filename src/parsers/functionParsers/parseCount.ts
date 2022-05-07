import { AnyObject, Count, SQL } from "@/types";
import { fullField } from "@/utils";
import { parseAggregateFunction } from "./parseAggregateFunction";
import { parseFunctions } from "./parseFunctions";

export const parseCount = <TF extends AnyObject>(
	table: string,
	func: Count<TF>
): SQL => {
	let body: string | null = null;

	if (typeof func.body !== "object") {
		body = fullField(table, func.body as string);
	} else {
		body = parseFunctions(table, func.body);
	}

	return parseAggregateFunction(func.type, body, func.distinct, func.name);
};
