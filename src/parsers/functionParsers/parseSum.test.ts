import { parseSum } from "./parseSum";

const table = "test-table";
const field = "field";
const name = "test-field";
const distinct = true;

describe("parseSum", () => {
	test("simple sum", () => {
		const sql = parseSum(table, { type: "sum", field });
		expect(sql).toBe(`SUM(${table}.${field})`);
	});
	test("with name", () => {
		const sql = parseSum(table, { type: "sum", field, name });
		expect(sql).toBe(`SUM(${table}.${field}) as ${name}`);
	});
	test("with distinct", () => {
		const sql = parseSum(table, { type: "sum", field, distinct });
		expect(sql).toBe(`SUM(DISTINCT ${table}.${field})`);
	});
	test("with distinct and name", () => {
		const sql = parseSum(table, { type: "sum", field, name, distinct });
		expect(sql).toBe(`SUM(DISTINCT ${table}.${field}) as ${name}`);
	});
});
