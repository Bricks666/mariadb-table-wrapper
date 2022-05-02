import { AnyObject, ForeignKeys } from "@/types";
import { parseJoinTables } from "./parseJoinTables";

const tableName = "test-table";
const foreignKeys: ForeignKeys<AnyObject> = {
	a: {
		field: "a",
		tableName: "a",
	},
	b: {
		field: "b",
		tableName: "b",
	},
};

const CONFIG_OBJECTS: AnyObject = {
	b: {
		table: "b",
		foreignKeys: {
			a: {
				field: "a",
				tableName: "a",
			},
		},
	},
	c: {
		table: "c",
		foreignKeys: {
			c: {
				field: "c",
				tableName,
			},
		},
	},
};

jest.mock("@/utils/receiveConfigs", () => ({
	receiveConfigs: (tableName: string) => CONFIG_OBJECTS[tableName],
}));

describe("parse Join Tables", () => {
	test("parse all join without recursive", () => {
		const sql = parseJoinTables(tableName, foreignKeys);

		expect(sql).toEqual(
			`INNER JOIN a ON ${tableName}.a = a.a INNER JOIN b ON ${tableName}.b = b.b`
		);
	});
	test("parse join table a", () => {
		const sql = parseJoinTables(tableName, foreignKeys, ["a"]);

		expect(sql).toEqual(`INNER JOIN a ON ${tableName}.a = a.a`);
	});
	test("parse join table b", () => {
		const sql = parseJoinTables(tableName, foreignKeys, ["b"]);

		expect(sql).toEqual(`INNER JOIN b ON ${tableName}.b = b.b`);
	});
	test("parse left join table b", () => {
		const sql = parseJoinTables(tableName, foreignKeys, [
			{ table: "b", type: "LEFT" },
		]);

		expect(sql).toEqual(`LEFT JOIN b ON ${tableName}.b = b.b`);
	});
	test("parse right join table b", () => {
		const sql = parseJoinTables(tableName, foreignKeys, [
			{ table: "b", type: "RIGHT" },
		]);

		expect(sql).toEqual(`RIGHT JOIN b ON ${tableName}.b = b.b`);
	});
	test("parse join with invert", () => {
		const sql = parseJoinTables(tableName, foreignKeys, [
			{ table: "c", invert: true },
		]);

		expect(sql).toEqual(`INNER JOIN c ON ${tableName}.c = c.c`);
	});
	test("parse join with recursive", () => {
		const sql = parseJoinTables(tableName, foreignKeys, ["b"], true);

		expect(sql).toEqual(
			`INNER JOIN b ON ${tableName}.b = b.b INNER JOIN a ON b.a = a.a`
		);
	});
	test("parse join recursive and invert", () => {
		const sql = parseJoinTables(
			tableName,
			foreignKeys,
			[{ table: "c", invert: true }, "b"],
			true
		);

		expect(sql).toEqual(
			`INNER JOIN c ON ${tableName}.c = c.c INNER JOIN b ON ${tableName}.b = b.b INNER JOIN a ON b.a = a.a`
		);
	});
});
