import { parseSetParams } from "./parseSetParams";

describe("parseSetParams", () => {
	test("string parse good", () => {
		const sql = parseSetParams({ a: "as" });

		expect(sql).toBe(`a = "as"`);
	});
	test("number parse good", () => {
		const sql = parseSetParams({ a: 5 });

		expect(sql).toBe(`a = 5`);
	});
	test("boolean parse good", () => {
		const sql = parseSetParams({ a: false });

		expect(sql).toBe(`a = false`);
	});
});
