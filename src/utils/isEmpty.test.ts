import { isEmpty } from "./isEmpty";

describe("isEmpty", () => {
	describe("not empty", () => {
		test("number", () => {
			expect(isEmpty(1)).toBeFalsy();
		});
		test("string", () => {
			expect(isEmpty(" ")).toBeFalsy();
		});
		test("symbol", () => {
			expect(isEmpty(Symbol("s"))).toBeFalsy();
		});
		test("object", () => {
			expect(isEmpty({ a: "" })).toBeFalsy();
		});
		test("array", () => {
			expect(isEmpty([15])).toBeFalsy();
		});
	});
	describe("empty", () => {
		test("number", () => {
			expect(isEmpty(0)).toBeTruthy();
		});
		test("string", () => {
			expect(isEmpty("")).toBeTruthy();
		});
		test("object", () => {
			expect(isEmpty({})).toBeTruthy();
		});
		test("array", () => {
			expect(isEmpty([])).toBeTruthy();
		});
		test("null", () => {
			expect(isEmpty(null)).toBeTruthy();
		});
		test("undefined", () => {
			expect(isEmpty(undefined)).toBeTruthy();
		});
	});
});
