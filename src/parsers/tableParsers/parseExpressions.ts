import { Expressions, Expression, SQL, ValidSQLType } from "@/types";
import { isArray, toString } from "@/utils";
import { parseExpression } from "./parseExpression";

export const parseExpressions = <T extends ValidSQLType>(
	field: string,
	check: Expressions<T>
): SQL => {
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
					parseExpression(field, expression as Expression<T>)
				),
				" AND "
			);
		}
	} else {
		condition = parseExpression(field, check);
	}

	return `(${condition})`;
};
