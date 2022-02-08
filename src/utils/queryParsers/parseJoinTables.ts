import { receiveConfigs, toString } from "..";
import { AnyObject, ForeignKeys, Reference, SQL } from "../../types";

const parseJoinTable = (
	tableName: string,
	[innerField, reference]: [string, Reference | undefined]
): SQL => {
	if (typeof reference === "undefined") {
		return "";
	}

	const SQLScript: SQL = `JOIN ${reference.tableName} ON  ${tableName}.${innerField} = ${reference.tableName}.${reference.field}`;

	return SQLScript;
};

export const parseJoinTables = <T extends AnyObject>(
	tableName: string,
	foreignKeys: ForeignKeys<T>,
	joinedTable?: string[],
	recurseJoin = false
): string => {
	const SQLcommands: SQL[] = Object.entries(foreignKeys)
		.filter(
			([, reference]) =>
				!joinedTable || joinedTable.includes(reference?.tableName as string)
		)
		.map((pair) => parseJoinTable(tableName, pair));

	if (recurseJoin) {
		Object.values(foreignKeys).forEach((reference) => {
			if (reference) {
				const referenceConfig = receiveConfigs(reference.tableName);
				if (!!referenceConfig && !!referenceConfig.foreignKeys) {
					const referenceJoin = parseJoinTables(
						referenceConfig.table,
						referenceConfig.foreignKeys
					);
					SQLcommands.push(referenceJoin);
				}
			}
		});
	}

	return toString(SQLcommands, " ");
};
