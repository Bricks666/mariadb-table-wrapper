export * from "mariadb";
import { createPool } from "mariadb";
import { Table } from "./lib";
import { SQLTypes } from "./types";
export * from "./types";
export * from "./utils";
interface User {
	userId: number;
	login: string;
	password: string;
}
interface Playlist {
	playlistId: number;
	playlistName: string;
	userId: number;
}

const usersT = new Table<User>({
	table: "users",
	fields: {
		login: {
			type: SQLTypes.VARCHAR,
			varcharLen: 64,
		},
		password: {
			type: SQLTypes.VARCHAR,
			varcharLen: 64,
		},
		userId: {
			type: SQLTypes.SMALLINT,
		},
	},
	safeCreating: true,
});

const playlistsT = new Table<Playlist>({
	table: "playlists",
	fields: {
		playlistName: {
			type: SQLTypes.VARCHAR,
			varcharLen: 64,
		},
		userId: {
			type: SQLTypes.SMALLINT,
			varcharLen: 64,
		},
		playlistId: {
			type: SQLTypes.SMALLINT,
		},
	},
	foreignKeys: {
		userId: {
			field: "userId",
			tableName: "users",
		},
	},
	safeCreating: true,
});

const pool = createPool({
	user: "root",
	password: "Root123",
	initSql: ["use Spotify;"],
	checkDuplicate: false,
});

const start = async () => {
	try {
		const connection = await pool.getConnection();
		await usersT.init(connection);
		await playlistsT.init(connection);

		const users = await usersT.select<Omit<User, "password">>({
			excludes: ["password"],
			filters: {},
			join: true,
		});
		const playlists = await playlistsT.select<Playlist & User>({
			excludes: ["playlistName"],
			join: true,
		});
		const playlists2 = await playlistsT.select<Playlist & User>({
			includes: ["playlistName", ["userId", "ownerId"]],
			filters: {
				userId: [3, 8],

			},
			join: true,
		});
		console.log(users);
		console.log(playlists);
		console.log(playlists2);
	} catch (e) {
		console.log(e);
	}
};

start();

export { Table };
