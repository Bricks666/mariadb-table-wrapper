import { isArray } from "./isArray";

describe("isArray", () => {
	describe("is array", () => {
		test("array", () => {
			expect(isArray([])).toBeTruthy();
		});
	});
	describe("is no array", () => {
		test("number", () => {
			expect(isArray(0)).toBeFalsy();
		});
		test("string", () => {
			expect(isArray("ad")).toBeFalsy();
		});
		test("null", () => {
			expect(isArray(null)).toBeFalsy();
		});
		test("undefined", () => {
			expect(isArray(undefined)).toBeFalsy();
		});
		test("object", () => {
			expect(isArray({})).toBeFalsy();
		});
		test("pseudo-array", () => {
			expect(isArray({ length: 0 })).toBeFalsy();
		});
	});
});
