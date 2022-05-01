import { isExpression } from "./isExpression";

describe("isExpression", () => {
	test("expression", () => {
		expect(isExpression({ operator: "=", value: "a" })).toBeTruthy();
	});
	test("invalid expression", () => {
		expect(isExpression({ value: "" })).toBeFalsy();
	});
	test("simple object", () => {
		expect(isExpression({ a: "a" })).toBeFalsy();
	});
	test("array", () => {
		expect(isExpression({ a: "a" })).toBeFalsy();
	});
	test("primitive", () => {
		expect(isExpression(0)).toBeFalsy();
	});
});
