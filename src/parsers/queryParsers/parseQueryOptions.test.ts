import { AnyObject, Limit, MappedObject, OrderBy, TableFilters } from "@/types";
import { parseQueryOptions } from "./parseQueryOptions";

const tableName = "test-table";
const limit: Limit = {
	page: 1,
	countOnPage: 2,
};
const orderBy: OrderBy<AnyObject> = {
	a: "ASC",
	b: "DESC",
};

const groupByArray = ["a", "b"];
const groupByObject = {
	[tableName]: ["a", "b"],
};
const whereSimple: TableFilters<AnyObject> = {
	a: {
		operator: "=",
		value: 15,
	},
};
const whereAnd: TableFilters<AnyObject> = {
	a: [
		{
			operator: "!=",
			value: 15,
			not: true,
		},
		{
			operator: "<=",
			value: "a",
		},
	],
};
const whereOr: TableFilters<AnyObject> = {
	a: [
		[
			{
				operator: "=",
				value: 15,
			},
		],
		[
			{
				operator: "between",
				value: [15, 16],
			},
		],
	],
};
const multiTableWhere: MappedObject<TableFilters<AnyObject>> = {
	users: {
		a: {
			operator: "!=",
			value: 15,
		},
	},
};

describe("parseQueryOptions", () => {
	test("parse empty options", () => {
		const sql = parseQueryOptions(tableName, {});
		expect(sql).toBe("");
	});
	test("parse limit", () => {
		const sql = parseQueryOptions(tableName, { limit });
		expect(sql).toBe("LIMIT 0,2");
	});
	test("parse order", () => {
		const sql = parseQueryOptions(tableName, { orderBy });
		expect(sql).toBe("ORDER BY a ASC,b DESC");
	});
	test("parse array groupBy", () => {
		const sql = parseQueryOptions(tableName, { groupBy: groupByArray });
		expect(sql).toBe(`GROUP BY ${tableName}.a, ${tableName}.b`);
	});
	test("parse object groupBy", () => {
		const sql = parseQueryOptions(tableName, { groupBy: groupByObject });
		expect(sql).toBe(`GROUP BY ${tableName}.a, ${tableName}.b`);
	});
	test("parse simple where", () => {
		const sql = parseQueryOptions(tableName, { filters: whereSimple });
		expect(sql).toBe(`WHERE (${tableName}.a = 15)`);
	});
	test("parse where with and", () => {
		const sql = parseQueryOptions(tableName, { filters: whereAnd });
		expect(sql).toBe(
			`WHERE (NOT ${tableName}.a != 15 AND ${tableName}.a <= "a")`
		);
	});
	test("parse where with or", () => {
		const sql = parseQueryOptions(tableName, { filters: whereOr });
		expect(sql).toBe(
			`WHERE ((${tableName}.a = 15) OR (${tableName}.a BETWEEN 15 AND 16))`
		);
	});
	test("parse multi table where", () => {
		const sql = parseQueryOptions(tableName, { filters: multiTableWhere });
		expect(sql).toBe("WHERE (users.a != 15)");
	});
	test("parse where and order", () => {
		const sql = parseQueryOptions(tableName, { filters: whereSimple, orderBy });
		expect(sql).toBe(`WHERE (${tableName}.a = 15) ORDER BY a ASC,b DESC`);
	});
	test("parse where and limit", () => {
		const sql = parseQueryOptions(tableName, { filters: whereSimple, limit });
		expect(sql).toBe(`WHERE (${tableName}.a = 15) LIMIT 0,2`);
	});
	test("parse where and groupBy", () => {
		const sql = parseQueryOptions(tableName, {
			filters: whereSimple,
			groupBy: groupByArray,
		});
		expect(sql).toBe(
			`WHERE (${tableName}.a = 15) GROUP BY ${tableName}.a, ${tableName}.b`
		);
	});
	test("parse groupBy and order", () => {
		const sql = parseQueryOptions(tableName, {
			groupBy: groupByArray,
			orderBy,
		});
		expect(sql).toBe(
			`GROUP BY ${tableName}.a, ${tableName}.b ORDER BY a ASC,b DESC`
		);
	});
	test("parse groupBy and limit", () => {
		const sql = parseQueryOptions(tableName, { groupBy: groupByArray, limit });
		expect(sql).toBe(`GROUP BY ${tableName}.a, ${tableName}.b LIMIT 0,2`);
	});
	test("parse limit and order", () => {
		const sql = parseQueryOptions(tableName, { limit, orderBy });
		expect(sql).toBe("ORDER BY a ASC,b DESC LIMIT 0,2");
	});
	test("parse all options", () => {
		const sql = parseQueryOptions(tableName, {
			filters: whereSimple,
			orderBy,
			limit,
			groupBy: groupByArray,
		});
		expect(sql).toBe(
			`WHERE (${tableName}.a = 15) GROUP BY ${tableName}.a, ${tableName}.b ORDER BY a ASC,b DESC LIMIT 0,2`
		);
	});
});
