import { Expression, ValidSQLType } from "@/types";

/**
 * TODO: Add operator check
 */
export const isExpression = <T extends ValidSQLType>(
	value: unknown
): value is Expression<T> => {
	return !!(
		(value as Expression<T>)?.value && (value as Expression<T>)?.operator
	);
};
