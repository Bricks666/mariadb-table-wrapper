import { AnyObject, Case } from "@/types";
import { parseCase } from "./parseCase";

const table = "test-table";
const field = "field";
const simpleCase: Case<AnyObject> = {
	type: "case",
	cases: [
		{
			table,
			field,
			expression: {
				operator: "=",
				value: 15,
			},
			value: 15,
		},
	],
};
const defaultCase: Case<AnyObject> = {
	...simpleCase,
	defaultValue: 0,
};

describe("parseCase", () => {
	test("simple case", () => {
		const sql = parseCase(simpleCase);
		expect(sql).toBe(`CASE WHEN (${table}.${field} = 15) THEN 15 END`);
	});
	test("with default", () => {
		const sql = parseCase(defaultCase);
		expect(sql).toBe(
			`CASE WHEN (${table}.${field} = 15) THEN 15 DEFAULT 0 END`
		);
	});
});
