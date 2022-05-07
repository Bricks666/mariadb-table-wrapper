import { Coalesce, SQL } from "@/types";
import { fullField, isObject, toString } from "@/utils";
import { parseFunction } from "./parseFunction";

export const parseCoalesce = (func: Coalesce): SQL => {
	const body = toString(
		func.values.map<string>((coalesce) => {
			return isObject(coalesce)
				? fullField(coalesce.table, coalesce.value)
				: coalesce;
		})
	);
	return parseFunction(func.type, body, func.name);
};
