import { AnyObject, Max, SQL } from "@/types";
import { fullField } from "@/utils";
import { parseAggregateFunction } from "./parseAggregateFunction";

export const parseMax = <TF extends AnyObject>(
	table: string,
	func: Max<TF>
): SQL => {
	const body = fullField(table, func.field as string);
	return parseAggregateFunction(func.type, body, func.distinct, func.name);
};
