import { toString } from "@/utils/toString";
import { receiveConfigs } from "@/utils/receiveConfigs";
import { AnyObject, ForeignKeys, Join, Reference, SQL } from "@/types";
import { ParamsError } from "@/lib";

type JoinRef = [string, Reference | undefined];
type JoinPair = [string, JoinRef];

const parseJoinTable = (
	tableName: string,
	[innerField, reference]: JoinRef
): SQL => {
	if (typeof reference === "undefined") {
		return "";
	}

	const SQLScript: SQL = `JOIN ${reference.tableName} ON ${tableName}.${innerField} = ${reference.tableName}.${reference.field}`;

	return SQLScript;
};

const convertFromInvert = (tableName: string, join: Join): JoinPair => {
	const { table } = join;
	const { foreignKeys } = receiveConfigs(table);
	if (!foreignKeys) {
		throw new ParamsError("select", "joinedTable", "incorrect invert join");
	}
	const referencePair = Object.entries(foreignKeys).find(
		([, reference]) => tableName === reference?.tableName
	);
	if (!referencePair) {
		throw new ParamsError("select", "joinedTable", "incorrect invert join");
	}

	return [
		tableName,
		[
			referencePair[1]!.field,
			{
				field: referencePair[0],
				tableName: table,
			},
		],
	];
};

const toJoinPair = (
	tableName: string,
	foreignPairs: JoinRef[],
	joinedTable: Array<Join | string>
): JoinPair[] => {
	return joinedTable.map((join) => {
		if (typeof join === "string") {
			const pair = foreignPairs.find(
				([, reference]) => reference?.tableName === join
			);
			if (!pair) {
				throw new Error();
			}
			return [tableName, pair];
		} else if (join.invert) {
			return convertFromInvert(tableName, join);
		}
		const pair = foreignPairs.find(
			([, reference]) => reference?.tableName === join.table
		);
		if (!pair) {
			throw new Error();
		}
		return [tableName, pair];
	});
};

export const parseJoinTables = <T extends AnyObject>(
	tableName: string,
	foreignKeys: ForeignKeys<T>,
	joinedTable?: Array<Join | string>,
	recurseJoin = false
): string => {
	const foreignPairs: JoinRef[] = Object.entries(foreignKeys);
	let joins: JoinPair[] = [];

	if (!joinedTable) {
		joins = foreignPairs.map((pair) => [tableName, pair]);
	} else {
		joins = toJoinPair(tableName, foreignPairs, joinedTable);
	}

	const SQLcommands: SQL[] = joins.map(([tableName, pair]) =>
		parseJoinTable(tableName, pair)
	);

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
