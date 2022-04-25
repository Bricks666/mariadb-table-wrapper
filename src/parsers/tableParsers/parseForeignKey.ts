import { Reference, SQL } from "@/types";
import { parseConstraint } from "@/utils";

export const parseForeignKey = (
	tableName: string,
	[fieldName, reference]: [string, Reference]
): SQL => {
	const validKey: SQL = `${parseConstraint(
		tableName,
		fieldName,
		"fk"
	)} FOREIGN KEY (${fieldName}) REFERENCES ${reference.tableName} (${
		reference.field
	}) ON DELETE ${reference.onDelete || "CASCADE"} ON UPDATE ${
		reference.onUpdate || "CASCADE"
	}`;
	return validKey;
};
