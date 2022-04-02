import { Table } from "./lib";
import { TableConfig } from "./types";
import { createConnection } from "mariadb";

interface T {
	readonly id: number;
	readonly name: string;
}

const config: TableConfig<T> = {
	table: "s",
	fields: {
		id: {
			type: "INT",
			isUnsigned: true,
			isPrimaryKey: true,
		},
		name: {
			type: "VARCHAR",
			isPrimaryKey: true,
			stringLen: 32,
		},
	},
	safeCreating: true,
};

const start = async () => {
	const table = new Table(config);
	debugger;
	const connection = await createConnection({
		user: "root",
		password: "Root123",
		initSql: ["create database if not exists A;", "use A;"],
	});

	await table.init(connection);

	await table.alter({
		type: "ADD FOREIGN KEY",
		fieldName: "id",
		reference: {
			field: "id",
			tableName: "users",
		},
	});

	console.log(await table.describe());
};

start();
