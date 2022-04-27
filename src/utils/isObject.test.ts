import { isObject } from "./isObject";

describe("isObject", () => {
	test("object is object", () => {
		expect(isObject({})).toBeTruthy();
	});
	test("null is not object", () => {
		expect(isObject(null)).toBeFalsy();
	});
	test("number is not object", () => {
		expect(isObject(0)).toBeFalsy();
	});
	test("string is not object", () => {
		expect(isObject("a")).toBeFalsy();
	});
	test("symbol is not object", () => {
		expect(isObject(Symbol("a"))).toBeFalsy();
	});
	test("undefined is not object", () => {
		expect(isObject(undefined)).toBeFalsy();
	});
	test("array is not object", () => {
		expect(isObject([])).toBeFalsy();
	});
});
