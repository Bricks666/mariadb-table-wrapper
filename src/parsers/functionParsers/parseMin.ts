import { AnyObject, Min, SQL } from "@/types";
import { fullField } from "@/utils";
import { parseAggregateFunction } from "./parseAggregateFunction";

export const parseMin = <TF extends AnyObject>(
	table: string,
	func: Min<TF>
): SQL => {
	const body = fullField(table, func.field as string);
	return parseAggregateFunction(func.type, body, func.distinct, func.name);
};
