import { AnyObject, Fields, ForeignKeys, SelectQuery, SQL } from "@/types";
import { fullField, getJoinedFields, toString } from "@/utils";
import { parseJoinTables } from "./parseJoinTables";
import { parseQueryOptions } from "./parseQueryOptions";
import { parseSelectedFields } from "./parseSelectedFields";

interface ParseSelectParams<TF extends AnyObject> {
	readonly table: string;
	readonly tableFields: Fields<TF>;
	readonly query: SelectQuery<TF>;
	readonly foreignKeys?: ForeignKeys<TF>;
}

export const parseSelect = <TF extends AnyObject>({
	table,
	query,
	tableFields,
	foreignKeys = {},
}: ParseSelectParams<TF>): SQL => {
	const {
		filters,
		excludes,
		includes,
		orderBy,
		joinedTable,
		groupBy,
		distinct,
		limit,
	} = query;
	/* TODO:  Добавить проверки входных параметров */
	const fields: string[] = Object.keys(tableFields).map((field) =>
		fullField(table, field)
	);

	let joinSQL: SQL = "";

	if (joinedTable?.enable) {
		joinSQL = parseJoinTables(
			table,
			foreignKeys,
			joinedTable.joinTable,
			joinedTable.recurseInclude
		);
		fields.push(
			...getJoinedFields(
				foreignKeys,
				joinedTable.joinTable,
				joinedTable.recurseInclude
			)
		);
	}

	const select: SQL = parseSelectedFields({
		tableName: table,
		fields,
		excludes,
		includes,
	});

	const options: SQL = parseQueryOptions(table, {
		filters,
		groupBy,
		orderBy,
		limit,
	});

	return toString(
		[
			"SELECT",
			distinct ? "DISTINCT" : "",
			select,
			"FROM",
			table,
			joinSQL,
			options,
		],
		" "
	);
};
