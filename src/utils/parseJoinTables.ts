import { parseExpression, toString } from ".";
import { SQL, TableJoin } from "../types";

const parseJoinTable = (join: TableJoin): SQL => {
	const expressions: SQL[] = join.expressions.map((exp) =>
		parseExpression(exp, join.innerTable, join.outerTable)
	);
	const expression: SQL = toString(expressions, " AND ");
	const SQLScript: SQL = `JOIN ${join.outerTable} ON  ${expression}`;

	return SQLScript;
};

export const parseJoinTables = (joins: TableJoin[]): string => {
	const SQLcommands: SQL[] = joins.map(parseJoinTable);

	return toString(SQLcommands, " ");
};
