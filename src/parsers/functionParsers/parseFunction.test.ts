import {
	AnyObject,
	Case,
	Count,
	IfNull,
	If,
	ValidSQLType,
	Expressions,
} from "@/types";
import { parseCase } from "./parseCase";
import { parseCount } from "./parseCount";
import { parseFunction } from "./parseFunction";
import { parseIf } from "./parseIf";
import { parseIfNull } from "./parseIfNull";

const table = "test-table";
const field = "field";
const expression: Expressions<ValidSQLType> = {
	operator: "!=",
	value: 15,
};
const count: Count<AnyObject> = {
	type: "count",
	body: "field",
};
const caseOptions: Case<AnyObject> = {
	type: "case",
	cases: [
		{
			table,
			field,
			expression,
			value: 10,
		},
	],
	defaultValue: 15,
};
const ifNull: IfNull<AnyObject> = {
	type: "ifnull",
	no: 15,
	field,
};
const ifFunc: If<AnyObject> = {
	type: "if",
	condition: expression,
	field,
};

describe("parseFunction", () => {
	test("count", () => {
		const sql = parseFunction(table, count);
		expect(sql).toBe(parseCount(table, count));
	});
	test("case", () => {
		const sql = parseFunction(table, caseOptions);
		expect(sql).toBe(parseCase(caseOptions));
	});
	test("if null", () => {
		const sql = parseFunction(table, ifNull);
		expect(sql).toBe(parseIfNull(table, ifNull));
	});
	test("if", () => {
		const sql = parseFunction(table, ifFunc);
		expect(sql).toBe(parseIf(table, ifFunc));
	});
});
