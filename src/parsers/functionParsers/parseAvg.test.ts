import { parseAvg } from "./parseAvg";

const table = "test-table";
const field = "field";

describe("parseAvg", () => {
	test("simple avg", () => {
		const sql = parseAvg(table, {
			type: "avg",
			field,
		});
		expect(sql).toBe(`AVG(${table}.${field})`);
	});
	test("with distinct", () => {
		const sql = parseAvg(table, {
			type: "avg",
			distinct: true,
			field,
		});
		expect(sql).toBe(`AVG(DISTINCT ${table}.${field})`);
	});
	test("with name", () => {
		const sql = parseAvg(table, {
			type: "avg",
			name: "test-field",
			field,
		});
		expect(sql).toBe(`AVG(${table}.${field}) as test-field`);
	});
	test("with name and distinct", () => {
		const sql = parseAvg(table, {
			type: "avg",
			distinct: true,
			name: "test-field",
			field,
		});
		expect(sql).toBe(`AVG(DISTINCT ${table}.${field}) as test-field`);
	});
});
