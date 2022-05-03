import { parseIfNull } from "./parseIfNull";

const table = "test-table";

describe("parseIfNull", () => {
	test("simple if null", () => {
		const sql = parseIfNull(table, {
			type: "ifnull",
			field: "field",
			no: "no",
		});
		expect(sql).toBe(`IFNULL(${table}.field, "no")`);
	});
	test("if null with name", () => {
		const sql = parseIfNull(table, {
			type: "ifnull",
			field: "field",
			no: "no",
			name: "asas",
		});
		expect(sql).toBe(`IFNULL(${table}.field, "no") as asas`);
	});
});
