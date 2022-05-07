import { AggregateFunctionNames, SQL } from "@/types";
import { parseFunction } from "./parseFunction";

export const parseAggregateFunction = (
	type: AggregateFunctionNames,
	body: string,
	distinct?: boolean,
	name?: string
): SQL => {
	body = (distinct ? "DISTINCT " : "") + body;

	return parseFunction(type, body, name);
};
