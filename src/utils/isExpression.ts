import { Expression } from "@/types";

/**
 * TODO: Add operator check
 */
export const isExpression = (value: unknown): value is Expression => {
	return !!((value as Expression)?.value && (value as Expression)?.operator);
};
