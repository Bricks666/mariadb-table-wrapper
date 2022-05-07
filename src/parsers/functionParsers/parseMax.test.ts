import { parseMax } from "./parseMax";

const table = "test-table";
const field = "field";
const name = "test-field";
const distinct = true;

describe("parseMax", () => {
	test("simple max", () => {
		const sql = parseMax(table, { type: "max", field });
		expect(sql).toBe(`MAX(${table}.${field})`);
	});
	test("with name", () => {
		const sql = parseMax(table, { type: "max", field, name });
		expect(sql).toBe(`MAX(${table}.${field}) as ${name}`);
	});
	test("with distinct", () => {
		const sql = parseMax(table, { type: "max", field, distinct });
		expect(sql).toBe(`MAX(DISTINCT ${table}.${field})`);
	});
	test("with distinct and name", () => {
		const sql = parseMax(table, { type: "max", field, name, distinct });
		expect(sql).toBe(`MAX(DISTINCT ${table}.${field}) as ${name}`);
	});
});
