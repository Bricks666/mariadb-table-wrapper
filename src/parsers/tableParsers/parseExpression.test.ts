import { ParamsError } from "@/lib";
import { parseExpression } from "./parseExpression";

describe("parseExpression", () => {
	describe("standard", () => {
		test("logic", () => {
			const sql = parseExpression("a", { operator: "!=", value: 15 });
			expect(sql).toBe("a != 15");
		});
		test("not", () => {
			const sql = parseExpression("a", {
				operator: "!=",
				value: 15,
				not: true,
			});
			expect(sql).toBe("NOT a != 15");
		});
		test("error", () => {
			expect(() => parseExpression("a", { operator: "!=" })).toThrowError(
				new ParamsError(
					"createTable",
					"parseExpression",
					"When use logic operator, value must be simple"
				)
			);
		});
	});
	describe("between", () => {
		test("standard", () => {
			const sql = parseExpression("a", {
				operator: "between",
				value: [15, 10],
			});
			expect(sql).toBe("a BETWEEN 15 AND 10");
		});
		test("not", () => {
			const sql = parseExpression("a", {
				operator: "between",
				value: [15, 10],
				not: true,
			});
			expect(sql).toBe("NOT a BETWEEN 15 AND 10");
		});
		test("error", () => {
			expect(() =>
				parseExpression("a", { operator: "between", value: [15, 16, 17] })
			).toThrowError(
				new ParamsError(
					"createTable",
					"parseExpression",
					"When use 'between' operator, value must be a tuple with length === 2"
				)
			);
		});
	});
	describe("in", () => {
		test("standard", () => {
			const sql = parseExpression("a", { operator: "in", value: [15, 10] });
			expect(sql).toBe("a IN (15, 10)");
		});
		test("not", () => {
			const sql = parseExpression("a", {
				operator: "in",
				value: [15, 10],
				not: true,
			});
			expect(sql).toBe("NOT a IN (15, 10)");
		});
		test("error", () => {
			expect(() => parseExpression("a", { operator: "in" })).toThrowError(
				new ParamsError(
					"createTable",
					"parseExpression",
					"When use 'in' operator, value must be an array"
				)
			);
		});
	});
	describe("like", () => {
		test("standard", () => {
			const sql = parseExpression("a", { operator: "like", template: "A" });
			expect(sql).toBe("a LIKE \"A\"");
		});
		test("not", () => {
			const sql = parseExpression("a", {
				operator: "like",
				template: "A",
				not: true,
			});
			expect(sql).toBe("NOT a LIKE \"A\"");
		});
		test("error", () => {
			expect(() => parseExpression("a", { operator: "like" })).toThrowError(
				new ParamsError(
					"createTable",
					"parseExpression",
					"When use 'like' operator or 'regExp' operator, value must be provided and be string"
				)
			);
		});
	});
	describe("regExp", () => {
		test("standard", () => {
			const sql = parseExpression("a", { operator: "regExp", template: "A" });
			expect(sql).toBe("a REGEXP \"A\"");
		});
		test("not", () => {
			const sql = parseExpression("a", {
				operator: "regExp",
				template: "A",
				not: true,
			});
			expect(sql).toBe("NOT a REGEXP \"A\"");
		});
		test("error", () => {
			expect(() => parseExpression("a", { operator: "regExp" })).toThrowError(
				new ParamsError(
					"createTable",
					"parseExpression",
					"When use 'like' operator or 'regExp' operator, value must be provided and be string"
				)
			);
		});
	});
});
