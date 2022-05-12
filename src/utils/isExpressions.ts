import { Expressions } from "@/types";
import { isArray } from "./isArray";
import { isExpression } from "./isExpression";

export const isExpressions = (value: unknown): value is Expressions => {
	return isExpression(value) || (isArray(value) && isExpressions(value[0]));
};
