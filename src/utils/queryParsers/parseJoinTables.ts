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
	foreignKeys: ForeignKeys<T>
): string => {
	const SQLcommands: SQL[] = Object.entries(foreignKeys).map((pair) =>
		parseJoinTable(tableName, pair)
	);
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

	return toString(SQLcommands, " ");
};
