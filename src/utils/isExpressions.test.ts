import { isExpressions } from "./isExpressions";

describe("isExpressions", () => {
	test("simple expression", () => {
		expect(isExpressions({ operator: "like", value: "a" })).toBeTruthy();
	});
	test("double expression", () => {
		expect(isExpressions([{ operator: "like", value: "a" }])).toBeTruthy();
	});
	test("triple expression", () => {
		expect(isExpressions([[{ operator: "like", value: "a" }]])).toBeTruthy();
	});
	test("invalid triple expression", () => {
		expect(isExpressions([[{ operator: "like" }]])).toBeFalsy();
	});
	test("simple array", () => {
		expect(isExpressions([])).toBeFalsy();
	});
	test("simple object", () => {
		expect(isExpressions({})).toBeFalsy();
	});
	test("primitive", () => {
		expect(isExpressions(0)).toBeFalsy();
	});
});
