import { Avg, SQL, AnyObject } from "@/types";
import { fullField } from "@/utils";
import { parseAggregateFunction } from "./parseAggregateFunction";

export const parseAvg = <TF extends AnyObject>(
	table: string,
	func: Avg<TF>
): SQL => {
	const body = fullField(table, func.field as string);
	return parseAggregateFunction(func.type, body, func.distinct, func.name);
};
