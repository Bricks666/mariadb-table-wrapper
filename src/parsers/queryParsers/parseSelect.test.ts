import { AnyObject, Fields, ForeignKeys, SelectQuery } from "@/types";
import { parseSelect } from "./parseSelect";

jest.mock("@/config", () => ({
	CONFIGS_OBJECT: {
		b: {
			table: "b",
			fields: {},
			foreignKeys: {},
		},
	},
}));

const table = "test-table";
const fields: Fields<AnyObject> = {
	field: {
		type: "BIGINT",
	},
};
const foreignKeys: ForeignKeys<AnyObject> = {
	field: {
		tableName: "table",
		field: "field",
	},
};
describe("parseSelect", () => {
	test("simple", () => {
		return void 0;
	});
	test("sub request", () => {
		const query: SelectQuery<AnyObject> = {
			filters: {
				field: {
					operator: "=",
					value: {
						table: "b",
						distinct: true,
					},
				},
			},
		};
		const sql = parseSelect({ table, tableFields: fields, foreignKeys, query });

		expect(sql).toBe(
			`SELECT * FROM ${table} WHERE (${table}.field = (SELECT DISTINCT * FROM b))`
		);
	});
});
