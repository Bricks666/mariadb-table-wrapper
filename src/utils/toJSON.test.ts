import { toJSON } from "./toJSON";

describe("toJSON", () => {
	test("empty array", () => {
		const sql = [].map(toJSON);
		expect(sql).toEqual([]);
	});
	test("numbers", () => {
		const sql = [15, 15].map(toJSON);
		expect(sql).toEqual(["15", "15"]);
	});
	test("strings", () => {
		const sql = ["a", "b"].map(toJSON);
		expect(sql).toEqual(["\"a\"", "\"b\""]);
	});
	test("strings and numbers", () => {
		const sql = [15, "a"].map(toJSON);
		expect(sql).toEqual(["15", "\"a\""]);
	});
	test("dont convert empty strings", () => {
		const sql = [""].map(toJSON);
		expect(sql).toEqual([""]);
	});
});
