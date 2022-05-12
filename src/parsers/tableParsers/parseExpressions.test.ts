import { Expression } from "@/types";
import { parseExpressions } from "./parseExpressions";

const expression: Expression = {
	operator: "!=",
	value: 15,
};

describe("parseExpressions", () => {
	test("simple expression", () => {
		const sql = parseExpressions("a", expression);
		expect(sql).toBe("(a != 15)");
	});
	test("expressions with and", () => {
		const sql = parseExpressions("a", [expression, expression]);
		expect(sql).toBe("(a != 15 AND a != 15)");
	});
	test("expressions with or", () => {
		const sql = parseExpressions("a", [
			[expression, expression],
			[expression, expression],
		]);
		expect(sql).toBe("((a != 15 AND a != 15) OR (a != 15 AND a != 15))");
	});
});
