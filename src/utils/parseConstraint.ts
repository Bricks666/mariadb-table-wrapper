import { toString } from "@/utils/toString";

export const parseConstraint = (
	tableName: string,
	field: string,
	prefix = ""
) => {
	return `CONSTRAINT ${toString([tableName, field, prefix], "_")}`;
};
