import { parseSQLValues } from "./parseSQLValues";

describe("parseSQLValues", () => {
	test("good parse", () => {
		const sql = parseSQLValues({ a: 0, b: "b" });

		expect(sql).toBe("0, \"b\"");
	});
});
