import { parsePrimaryKeys } from "./parsePrimaryKeys";

const tableName = "test-table";
describe("parsePrimaryKeys", () => {
	test("one key", () => {
		const sql = parsePrimaryKeys(tableName, ["a"]);
		expect(sql).toBe(`CONSTRAINT ${tableName}_pk PRIMARY KEY(a)`);
	});
	test("several keys", () => {
		const sql = parsePrimaryKeys(tableName, ["a", "b", "c"]);
		expect(sql).toBe(`CONSTRAINT ${tableName}_pk PRIMARY KEY(a, b, c)`);
	});
	test("no key", () => {
		const sql = parsePrimaryKeys(tableName, []);
		expect(sql).toBe("");
	});
});
