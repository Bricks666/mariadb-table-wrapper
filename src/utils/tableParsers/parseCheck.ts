import { Check, Expression, SQL, ValidSQLType } from "@/types";
import { isArray, toString } from "@/utils";
import { parseExpression } from ".";

export const parseCheck = <T extends ValidSQLType>(
	field: string,
	check: Check<T>
): SQL => {
	let condition: SQL = "";

	if (isArray(check)) {
		if (isArray(check[0])) {
			condition = toString(
				check.map((check) => parseCheck(field, check)),
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

	return condition;
};
