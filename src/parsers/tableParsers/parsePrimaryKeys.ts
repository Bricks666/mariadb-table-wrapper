import { toString, parseConstraint } from "@/utils";
import { SQL } from "@/types";

export const parsePrimaryKeys = (
	tableName: string,
	primaryKeys: string[]
): SQL => {
	const keys = toString(primaryKeys);
	return keys && `${parseConstraint(tableName, "", "pk")} PRIMARY KEY(${keys})`;
};
