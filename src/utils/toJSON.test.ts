import { toJSON } from "./toJSON";

describe("toJSON", () => {
	test("empty array", () => {
		const sql = toJSON([]);
		expect(sql).toEqual([]);
	});
	test("numbers", () => {
		const sql = toJSON([15, 15]);
		expect(sql).toEqual(["15", "15"]);
	});
	test("strings", () => {
		const sql = toJSON(["a", "b"]);
		expect(sql).toEqual(["\"a\"", "\"b\""]);
	});
	test("strings and numbers", () => {
		const sql = toJSON([15, "a"]);
		expect(sql).toEqual(["15", "\"a\""]);
	});
	test("dont convert empty strings", () => {
		const sql = toJSON([""]);
		expect(sql).toEqual([]);
	});
});
