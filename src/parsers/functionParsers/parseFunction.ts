import { AnyObject, Functions, SQL } from "@/types";
import { parseCase } from "./parseCase";
import { parseCount } from "./parseCount";
import { parseIf } from "./parseIf";
import { parseIfNull } from "./parseIfNull";
export const parseFunction = <TF extends AnyObject>(
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
      return ""
    }
	}
};
