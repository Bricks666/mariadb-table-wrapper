import { ForeignKeys, AnyObject } from "@/types";
import { getJoinedFields } from "./getJoinedFields";
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

const config: AnyObject = {
	a: {
		table: "a",
		fields: {
			a: {},
			c: {},
		},
	},
	b: {
		table: "b",
		fields: {
			b: {},
			d: {},
		},
		foreignKeys: {
			c: {
				field: "c",
				tableName: "c",
			},
		},
	},
	c: {
		table: "c",
		fields: {
			c: {},
			d: {},
		},
	},
};

jest.mock("./receiveConfigs", () => ({
	receiveConfigs: (key: string) => config[key],
}));

describe("getJoinedFields", () => {
	describe("only keys", () => {
		test("get keys", () => {
			const fields = getJoinedFields(foreignKeys);
			expect(fields).toEqual(["a.c", "b.d"]);
		});
	});
	describe("with joinedTable", () => {
		test("join a", () => {
			const fields = getJoinedFields(foreignKeys, ["a"]);
			expect(fields).toEqual(["a.c"]);
		});
		test("join b", () => {
			const fields = getJoinedFields(foreignKeys, ["b"]);
			expect(fields).toEqual(["b.d"]);
		});
	});
	describe("with recurse", () => {
		test("b with recurse", () => {
			const fields = getJoinedFields(foreignKeys, ["b"], true);
			expect(fields).toEqual(["b.d", "c.d"]);
		});
		test("a with recurse", () => {
			const fields = getJoinedFields(foreignKeys, ["a"], true);
			expect(fields).toEqual(["a.c"]);
		});
	});
});
