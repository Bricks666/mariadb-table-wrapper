import { undefinedToNull } from "./undefinedToNull";

describe("undefinedToNull", () => {
	test("change one undefined to null", () => {
		const object = undefinedToNull({
			a: undefined,
		});
		expect(object).toEqual({ a: null });
	});
	test("change several undefined to null", () => {
		const object = undefinedToNull({
			a: undefined,
			b: undefined,
		});
		expect(object).toEqual({ a: null, b: null });
	});
	test("change undefined to null and don't change others values", () => {
		const object = undefinedToNull({
			a: undefined,
			b: "A",
		});
		expect(object).toEqual({ a: null, b: "A" });
	});
	test("do nothing", () => {
		const object = undefinedToNull({
			b: "A",
		});
		expect(object).toEqual({ b: "A" });
	});
});
