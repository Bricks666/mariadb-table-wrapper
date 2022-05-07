import { AnyObject, SQL, Sum } from "@/types";
import { fullField } from "@/utils";
import { parseAggregateFunction } from "./parseAggregateFunction";

export const parseSum = <TF extends AnyObject>(
	table: string,
	func: Sum<TF>
): SQL => {
	const body = fullField(table, func.field as string);
	return parseAggregateFunction(func.type, body, func.distinct, func.name);
};
