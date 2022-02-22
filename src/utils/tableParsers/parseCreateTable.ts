import { parseField, parseForeignKey, parsePrimaryKeys } from ".";
import { Fields, ForeignKeys, MappedObject, Reference, SQL } from "@/types";
import { toString } from "@/utils";

export const parseCreateTable = <TF extends MappedObject<string>>(
	tableName: string,
	fields: Fields<TF>,
	safeCreating: boolean,
	foreignKeys?: ForeignKeys<TF>
): SQL => {
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

	const SQLScript: SQL = `CREATE TABLE ${
		safeCreating ? "IF NOT EXISTS" : ""
	} ${tableName}(${parsedFields}${primaryKey && "," + primaryKey}${
		parsedForeignKeys && "," + parsedForeignKeys
	});`;

	return SQLScript;
};
