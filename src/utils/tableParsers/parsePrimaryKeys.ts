import { toString } from "..";
import { SQL } from "@/types";

export const parsePrimaryKeys = (
	tableName: string,
	primaryKeys: string[]
): SQL => {
	const keys = toString(primaryKeys);
	return keys && ` CONSTRAINT ${tableName}_pk PRIMARY KEY(${keys})`;
};
