import { Check, SQL, ValidSQLType } from "@/types";
import { isArray, toString } from "@/utils";
import { parseExpression } from ".";

export const parseCheck = <T extends ValidSQLType>(
	field: string,
	check: Check<T>
): SQL => {
	let condition: SQL = "";

	if (isArray(check)) {
		condition = toString(
			check.map((expression) => parseExpression(field, expression)),
			" OR "
		);
	} else {
		condition = parseExpression(field, check);
	}

	return `CHECK (${condition})`;
};
