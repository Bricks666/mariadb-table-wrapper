export * from "mariadb";
export * from "./types";
export * from "./utils";
export { Table } from "./lib";
import { createConnection } from "mariadb";
import { Table } from "./lib/Table";

type Set = "S" | "B" | "C";

interface Test {
	readonly id: number;
	readonly s: Set;
}

const table = new Table<Test>({
	table: "test",
	fields: {
		id: {
			type: "SMALLINT",
			isPrimaryKey: true,
			isUnsigned: true,
			check: {
				operator: "<=",
				value: 5,
			},
			default: 1,
		},
		s: {
			type: "SET",
			enumSetValues: ["B", "C", "S"],
			isNotNull: true,
			check: [
				{
					operator: "in",
					value: ["B", "C"],
				},
				{
					operator: "!=",
					value: "B",
				},
			],
			default: "S",
		},
	},
	safeCreating: true,
});

const start = async () => {
	try {
		const connection = await createConnection({
			user: "root",
			password: "Root123",
			initSql: ["CREATE DATABASE IF NOT EXISTS test;", "USE test;"],
		});
		await table.init(connection);
		await table.select({
			filters: {
				id: {
					operator: "=",
					value: 1,
				},
				s: {
					operator: "in",
					not: true,
					value: ["B", "S"],
				},
			},
		});
		const desc = await table.describe();
		console.log(desc);
	} catch (e) {
		console.log(e);
	}
};

start();
