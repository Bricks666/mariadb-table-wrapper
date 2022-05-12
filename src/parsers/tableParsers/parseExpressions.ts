import { Expressions, Expression, SQL } from "@/types";
import { isArray, toString } from "@/utils";
import { parseExpression } from "./parseExpression";

export const parseExpressions = (field: string, check: Expressions): SQL => {
	let condition: SQL = "";

	if (isArray(check)) {
		if (isArray(check[0])) {
			condition = toString(
				check.map((check) => parseExpressions(field, check)),
				" OR "
			);
		} else {
			condition = toString(
				check.map((expression) =>
					parseExpression(field, expression as Expression)
				),
				" AND "
			);
		}
	} else {
		condition = parseExpression(field, check);
	}

	return `(${condition})`;
};
