import {
	AnyObject,
	Case,
	Count,
	IfNull,
	If,
	ValidSQLType,
	Expressions,
	Max,
	Min,
	Coalesce,
	Sum,
	Avg,
} from "@/types";
import { parseAvg } from "./parseAvg";
import { parseCase } from "./parseCase";
import { parseCoalesce } from "./parseCoalesce";
import { parseCount } from "./parseCount";
import { parseFunctions } from "./parseFunctions";
import { parseIf } from "./parseIf";
import { parseIfNull } from "./parseIfNull";
import { parseMax } from "./parseMax";
import { parseMin } from "./parseMin";
import { parseSum } from "./parseSum";

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
const caseOptions: Case = {
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
const coalesce: Coalesce = {
	type: "coalesce",
	values: [
		{
			table,
			value: field,
		},
		field,
	],
};
const max: Max<AnyObject> = {
	type: "max",
	field,
};
const min: Min<AnyObject> = {
	type: "min",
	field,
};
const sum: Sum<AnyObject> = {
	type: "sum",
	field,
};
const avg: Avg<AnyObject> = {
	type: "avg",
	field,
};

describe("parseFunctions", () => {
	test("count", () => {
		const sql = parseFunctions(table, count);
		expect(sql).toBe(parseCount(table, count));
	});
	test("case", () => {
		const sql = parseFunctions(table, caseOptions);
		expect(sql).toBe(parseCase(caseOptions));
	});
	test("if null", () => {
		const sql = parseFunctions(table, ifNull);
		expect(sql).toBe(parseIfNull(table, ifNull));
	});
	test("if", () => {
		const sql = parseFunctions(table, ifFunc);
		expect(sql).toBe(parseIf(table, ifFunc));
	});
	test("coalesce", () => {
		const sql = parseFunctions(table, coalesce);
		expect(sql).toBe(parseCoalesce(coalesce));
	});
	test("max", () => {
		const sql = parseFunctions(table, max);
		expect(sql).toBe(parseMax(table, max));
	});
	test("min", () => {
		const sql = parseFunctions(table, min);
		expect(sql).toBe(parseMin(table, min));
	});
	test("sum", () => {
		const sql = parseFunctions(table, sum);
		expect(sql).toBe(parseSum(table, sum));
	});
	test("avg", () => {
		const sql = parseFunctions(table, avg);
		expect(sql).toBe(parseAvg(table, avg));
	});
});
