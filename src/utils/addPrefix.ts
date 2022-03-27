import { ValidSQLType } from "@/types";

export const addPrefix = (
	value: ValidSQLType,
	prefix: ValidSQLType
): string => {
	return `${prefix}.${value}`;
};
