import { Fields, ForeignKeys, MappedObject, Reference, SQL } from "@/types";
import { toString } from "@/utils/toString";
import { parseField } from "./parseField";
import { parseForeignKey } from "./parseForeignKey";
import { parsePrimaryKeys } from "./parsePrimaryKeys";

export const parseCreateTable = <TF extends MappedObject<string>>(
	tableName: string,
	fields: Fields<TF>,
	safeCreating: boolean,
	foreignKeys?: ForeignKeys<TF>
): SQL => {
	debugger;
	const fieldPairs = Object.entries(fields);
	const parsedFields: SQL = toString(fieldPairs.map(parseField));

	let parsedForeignKeys: SQL = "";
	if (typeof foreignKeys !== "undefined") {
		parsedForeignKeys = toString(
			Object.entries(foreignKeys)
				.filter(
					(pair): pair is [string, Reference] => typeof pair[1] !== "undefined"
				)
				.map(parseForeignKey)
		);
	}

	const primaryKey = parsePrimaryKeys(fields);

	return `CREATE TABLE ${
		safeCreating ? "IF NOT EXISTS" : ""
	} ${tableName}(${parsedFields}${primaryKey && "," + primaryKey}${
		parsedForeignKeys && "," + parsedForeignKeys
	});`;
};
