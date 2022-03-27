import { Table } from "./lib";
import { TableConfig } from "./types";
import { createConnection } from "mariadb";

const ROOMS_TABLE = "rooms";
const USERS_TABLE = "users";
const TASKS_TABLE = "todos";

interface RoomModel {
	readonly roomId: number;
	readonly roomName: string;
	readonly roomDescription: string;
	readonly ownerId: number;
}
interface UserModel {
	readonly userId: number;
	readonly login: string;
	readonly password: string;
	readonly photo?: string | undefined;
}
interface TaskModelShort {
	readonly todoId: number;
	readonly roomId: number;
	readonly groupId: number;
	readonly authorId: number;
	readonly content: string;
	readonly date: string;
}

const usersConfig: TableConfig<UserModel> = {
	table: USERS_TABLE,
	fields: {
		userId: {
			type: "SMALLINT",
			isAutoIncrement: true,
			isNotNull: true,
			isPrimaryKey: true,
			isUnsigned: true,
		},

		login: {
			type: "VARCHAR",
			isUnique: true,
			isNotNull: true,
			stringLen: 32,
		},
		password: {
			type: "VARCHAR",
			stringLen: 128,
			isNotNull: true,
		},
		photo: {
			type: "VARCHAR",
			stringLen: 128,
		},
	},
	safeCreating: true,
};

const config: TableConfig<RoomModel> = {
	table: ROOMS_TABLE,
	fields: {
		roomId: {
			type: "SMALLINT",
			isPrimaryKey: true,
			isAutoIncrement: true,
			isUnsigned: true,
		},
		roomName: {
			type: "VARCHAR",
			isNotNull: true,
			default: "Room",
			stringLen: 32,
		},
		roomDescription: {
			type: "VARCHAR",
			isNotNull: true,
			default: "",
			stringLen: 32,
		},
		ownerId: {
			type: "SMALLINT",
			isUnsigned: true,
			isNotNull: true,
		},
	},
	foreignKeys: {
		ownerId: {
			field: "userId",
			tableName: USERS_TABLE,
		},
	},
	safeCreating: true,
};

const tasksConfig: TableConfig<TaskModelShort> = {
	table: TASKS_TABLE,
	fields: {
		todoId: {
			type: "SMALLINT",
			isPrimaryKey: true,
			isAutoIncrement: true,
			isNotNull: true,
			isUnsigned: true,
		},
		roomId: {
			type: "SMALLINT",
			isNotNull: true,
			isUnsigned: true,
		},
		groupId: {
			type: "SMALLINT",
			isUnsigned: true,
			isNotNull: true,
		},
		authorId: {
			type: "SMALLINT",
			isNotNull: true,
			isUnsigned: true,
		},
		content: {
			type: "VARCHAR",
			stringLen: 128,
			isNotNull: true,
		},
		date: {
			type: "DATETIME",
			isNotNull: true,
		},
	},
	safeCreating: true,
	foreignKeys: {
		authorId: {
			tableName: USERS_TABLE,
			field: "userId",
		},
		roomId: {
			tableName: ROOMS_TABLE,
			field: "roomId",
		},
	},
};

const RoomsTable = new Table(config);
const TasksTable = new Table(tasksConfig);
const UsersTable = new Table(usersConfig);

const start = async () => {
	try {
		debugger;
		const connection = await createConnection({
			user: "root",
			password: "Root123",
			initSql: ["Use Todo;"],
		});

		await UsersTable.init(connection);
		await TasksTable.init(connection);
		await RoomsTable.init(connection);

		const rooms = await RoomsTable.select({
			joinedTable: {
				enable: true,
				joinTable: [USERS_TABLE, { table: TASKS_TABLE, invert: true }],
			},
			includes: {
				[ROOMS_TABLE]: ["*"],
			},
			count: {
				[TASKS_TABLE]: [["todoId", "todoCount"]],
			},
		});
		console.log(rooms);
	} catch (e) {
		console.error(e);
	}
};

start();
