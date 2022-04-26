import { parseSQLKeys } from "./parseSQLKeys";

describe("parseSQLKeys", () => {
	test("valid parse", () => {
		const sql = parseSQLKeys({ a: 0, b: 3 });

		expect(sql).toBe("a, b");
	});
});
