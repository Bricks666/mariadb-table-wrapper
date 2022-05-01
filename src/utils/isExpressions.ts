import { Expressions, ValidSQLType } from "@/types";
import { isArray } from "./isArray";
import { isExpression } from "./isExpression";

export const isExpressions = <T extends ValidSQLType>(
	value: unknown
): value is Expressions<T> => {
	return isExpression(value) || (isArray(value) && isExpressions(value[0]));
};
