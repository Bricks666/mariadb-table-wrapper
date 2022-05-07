import { AnyObject, Functions, SQL } from "@/types";
import { parseAvg } from "./parseAvg";
import { parseCase } from "./parseCase";
import { parseCoalesce } from "./parseCoalesce";
import { parseCount } from "./parseCount";
import { parseIf } from "./parseIf";
import { parseIfNull } from "./parseIfNull";
import { parseMax } from "./parseMax";
import { parseMin } from "./parseMin";
import { parseSum } from "./parseSum";
export const parseFunctions = <TF extends AnyObject>(
	table: string,
	func: Functions<TF>
): SQL => {
	switch (func.type) {
		case "case": {
			return parseCase(func);
		}
		case "count": {
			return parseCount(table, func);
		}
		case "if": {
			return parseIf(table, func);
		}
		case "ifnull": {
			return parseIfNull(table, func);
		}
		case "coalesce": {
			return parseCoalesce(func);
		}
		case "avg": {
			return parseAvg(table, func);
		}
		case "max": {
			return parseMax(table, func);
		}
		case "min": {
			return parseMin(table, func);
		}
		case "sum": {
			return parseSum(table, func);
		}
	}
};
