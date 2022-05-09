import { MappedObject, Reference, SQL, TableConfig } from "@/types";
import { toString } from "@/utils";
import { parseField } from "./parseField";
import { parseForeignKey } from "./parseForeignKey";
import { parsePrimaryKeys } from "./parsePrimaryKeys";

export const parseCreateTable = <TF extends MappedObject<string>>({
	table,
	fields,
	safeCreating,
	foreignKeys,
}: TableConfig<TF>): SQL => {
	const fieldPairs = Object.entries(fields);
	const parsedFields: SQL = toString(fieldPairs.map(parseField));
	const exists = safeCreating ? "IF NOT EXISTS" : "";
	let parsedForeignKeys: SQL = "";
	if (typeof foreignKeys !== "undefined") {
		parsedForeignKeys = toString(
			Object.entries(foreignKeys)
				.filter(
					(pair): pair is [string, Reference] => typeof pair[1] !== "undefined"
				)
				.map((pair) => parseForeignKey(table, pair))
		);
	}

	const primaryKey = parsePrimaryKeys(
		table,
		Object.entries(fields)
			.filter(([, config]) => config.isPrimaryKey)
			.map(([name]) => name)
	);

	const tableConfig = `${table}(${toString([
		parsedFields,
		primaryKey,
		parsedForeignKeys,
	])})`;
	return toString([exists, tableConfig], " ");
};
