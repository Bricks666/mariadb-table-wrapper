import { parsePrimaryKeys } from "./parsePrimaryKeys";

describe("parsePrimaryKeys", () => {
	test("one key", () => {
		const sql = parsePrimaryKeys("test-table", ["a"]);
		expect(sql).toBe("CONSTRAINT test-table_pk PRIMARY KEY(a)");
	});
	test("several keys", () => {
		const sql = parsePrimaryKeys("test-table", ["a", "b", "c"]);
		expect(sql).toBe("CONSTRAINT test-table_pk PRIMARY KEY(a, b, c)");
	});
	test("no key", () => {
		const sql = parsePrimaryKeys("test-table", []);
		expect(sql).toBe("");
	});
});
