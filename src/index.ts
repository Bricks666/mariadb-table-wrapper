export * from "mariadb";
export * from "./types";
export * from "./utils";
import { createConnection } from "mariadb";
import { Table } from "./lib";
import { SQLTypes } from "./types";

const user = new Table({
	table: "todos",
	fields: {
		todoId: {
			type: SQLTypes.SMALLINT,
			isPrimaryKey: true,
			isAutoIncrement: true,
			isNotNull: true,
			isUnsigned: true,
		},
		groupId: {
			type: SQLTypes.SMALLINT,
			isUnsigned: true,
			isNotNull: true,
		},
		authorId: {
			type: SQLTypes.SMALLINT,
			isNotNull: true,
			isUnsigned: true,
		},
		content: {
			type: SQLTypes.VARCHAR,
			stringLen: 128,
			isNotNull: true,
		},
		date: {
			type: SQLTypes.DATE,
			isNotNull: true,
		},
		isDone: {
			type: SQLTypes.BOOLEAN,
			isNotNull: true,
		},
	},
	safeCreating: true,
});

const start = async () => {
	try {
		const connection = await createConnection({
			user: "root",
			password: "Root123",
			initSql: ["use Todo;"],
		});

		await user.init(connection);

		const grouped = await user.select({
			groupBy: ["groupId"],
			includes: ["groupId"],
			count: [["*", "tasksCount"]],
		});
		console.log(grouped);
		process.exit();
	} catch (e) {
		console.log(e);
	}
};

start();
