import { parseField, parseForeignKey, parsePrimaryKeys, toString } from ".";
import {
	FieldConfig,
	MappedObject,
	Reference,
	SQL,
	TableConfig,
} from "../types";

export const parseCreateTable = <TF extends MappedObject<string>>(
	config: TableConfig<TF>
): SQL => {
	const fieldPairs = Object.entries<FieldConfig>(config.fields);
	const fields: SQL = toString(fieldPairs.map(parseField));

	let foreignKeys: SQL = "";
	if (typeof config.foreignKeys !== "undefined") {
		foreignKeys = toString(
			Object.entries(config.foreignKeys)
				.filter(
					(pair): pair is [string, Reference] => typeof pair[1] !== "undefined"
				)
				.map(parseForeignKey)
		);
	}

	const primaryKey = parsePrimaryKeys(config.fields);
	const SQLScript: SQL = `CREATE TABLE ${
		config.safeCreating ? "IF NOT EXISTS" : ""
	} ${config.table}(${fields},${primaryKey}${
		foreignKeys !== "" ? "," + foreignKeys : ""
	});`;

	return SQLScript;
};
