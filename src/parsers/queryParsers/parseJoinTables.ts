import { toString } from "@/utils/toString";
import { receiveConfigs } from "@/utils/receiveConfigs";
import {
	AnyObject,
	ForeignKeys,
	Join,
	JoinType,
	Reference,
	SQL,
} from "@/types";
import { ParamsError } from "@/lib";

type JoinRef = [string, Reference | undefined];

type JoinConfig = {
	readonly table: string;
	readonly field: string;
	readonly reference: Reference;
	readonly type?: JoinType;
};

const parseJoinTable = ({
	field,
	reference,
	table,
	type = "INNER",
}: JoinConfig): SQL => {
	return `${type} JOIN ${reference.tableName} ON ${table}.${field} = ${reference.tableName}.${reference.field}`;
};
const convertFromInvert = (tableName: string, join: Join): JoinConfig => {
	const { table, type } = join;
	const config = receiveConfigs(table);
	if (!config || !config.foreignKeys) {
		throw new ParamsError("select", "joinedTable", "incorrect invert join");
	}
	const referencePair = Object.entries(config.foreignKeys).find(
		([, reference]) => tableName === reference?.tableName
	);
	if (!referencePair) {
		throw new ParamsError("select", "joinedTable", "incorrect invert join");
	}
	return {
		table: tableName,
		field: referencePair[0],
		reference: {
			tableName: table,
			field: referencePair[1]!.field,
		},
		type: type,
	};
};

const toJoinPair = (
	tableName: string,
	foreignPairs: JoinRef[],
	joinedTable: Array<Join | string>
): JoinConfig[] => {
	return joinedTable.map((join) => {
		if (typeof join === "string") {
			const pair = foreignPairs.find(
				([, reference]) => reference?.tableName === join
			);
			if (!pair) {
				throw new Error();
			}
			return { field: pair[0], reference: pair[1]!, table: tableName };
		} else if (join.invert) {
			return convertFromInvert(tableName, join);
		}
		const pair = foreignPairs.find(
			([, reference]) => reference?.tableName === join.table
		);
		if (!pair) {
			throw new Error();
		}
		return {
			field: pair[0],
			reference: pair[1]!,
			table: tableName,
			type: join.type,
		};
	});
};

export const parseJoinTables = <T extends AnyObject>(
	tableName: string,
	foreignKeys: ForeignKeys<T>,
	joinedTable?: Array<Join | string>,
	recurseJoin = false
): string => {
	const foreignPairs: JoinRef[] = Object.entries(foreignKeys);
	let joins: JoinConfig[] = [];

	if (!joinedTable) {
		joins = foreignPairs.map<JoinConfig>((pair) => ({
			table: tableName,
			field: pair[0],
			reference: pair[1]!,
		}));
	} else {
		joins = toJoinPair(tableName, foreignPairs, joinedTable);
	}

	const SQLcommands: SQL[] = joins.map(parseJoinTable);
	/** TODO: rework recursive include */
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
