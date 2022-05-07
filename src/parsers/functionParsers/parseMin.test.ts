import { parseMin } from "./parseMin";

const table = "test-table";
const field = "field";
const name = "test-field";
const distinct = true;

describe("parseMin", () => {
	test("simple min", () => {
		const sql = parseMin(table, { type: "min", field });
		expect(sql).toBe(`MIN(${table}.${field})`);
	});
	test("with name", () => {
		const sql = parseMin(table, { type: "min", field, name });
		expect(sql).toBe(`MIN(${table}.${field}) as ${name}`);
	});
	test("with distinct", () => {
		const sql = parseMin(table, { type: "min", field, distinct });
		expect(sql).toBe(`MIN(DISTINCT ${table}.${field})`);
	});
	test("with distinct and name", () => {
		const sql = parseMin(table, { type: "min", field, name, distinct });
		expect(sql).toBe(`MIN(DISTINCT ${table}.${field}) as ${name}`);
	});
});
