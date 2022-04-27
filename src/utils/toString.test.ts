import { toString } from "./toString";

describe("toString", () => {
	test("with empty array", () => {
		const sql = toString([]);
		expect(sql).toBe("");
	});
	test("join numbers", () => {
		const sql = toString([15, 15, 15]);
		expect(sql).toBe("15, 15, 15");
	});
	test("join strings", () => {
		const sql = toString(["a", "v", "d"]);
		expect(sql).toBe("a, v, d");
	});
	test("join strings and numbers", () => {
		const sql = toString([15, "a", "n"]);
		expect(sql).toBe("15, a, n");
	});
	test("dont include empty string", () => {
		const sql = toString(["", 15]);
		expect(sql).toBe("15");
	});
	test("include 0", () => {
		const sql = toString([0]);
		expect(sql).toBe("0");
	});
	test("change separator", () => {
		const sql = toString([15, 15], " ");
		expect(sql).toBe("15 15");
	});
});
