import { AnyObject, Count, IncludeFields } from "@/types";
import { addPrefix } from "@/utils";
import { parseSelectedFields } from "./parseSelectedFields";

const tableName = "test-table";
const fields = ["a", "b", "c"].map((field) => addPrefix(field, tableName));
const includesArray: IncludeFields<AnyObject> = ["a", "b"];
const includesArrayWithAssociation: IncludeFields<AnyObject> = [
	"a",
	["b", "ass"],
];
const includesObject = {
	[tableName]: ["a", "c"],
};
const excludesArray = ["a"];
const excludesObject = {
	[tableName]: ["a"],
};
const count: Count<AnyObject> = [["*", "h"]];
const objectCount: Count<AnyObject> = [
	{
		field: "*",
		expressions: {
			operator: "=",
			value: 15,
		},
		name: "h",
	},
];

describe("parseSelectedFields", () => {
	test("all fields", () => {
		const sql = parseSelectedFields({ tableName, fields });

		expect(sql).toBe("*");
	});
	test("includes array", () => {
		const sql = parseSelectedFields({
			tableName,
			fields,
			includes: includesArray,
		});

		expect(sql).toBe(`${tableName}.a, ${tableName}.b`);
	});
	test("includes with association array", () => {
		const sql = parseSelectedFields({
			tableName,
			fields,
			includes: includesArrayWithAssociation,
		});

		expect(sql).toBe(`${tableName}.a, ${tableName}.b as ass`);
	});
	test("includes object", () => {
		const sql = parseSelectedFields({
			tableName,
			fields,
			includes: includesObject,
		});

		expect(sql).toBe(`${tableName}.a, ${tableName}.c`);
	});
	test("excludes array", () => {
		const sql = parseSelectedFields({
			tableName,
			fields,
			excludes: excludesArray,
		});

		expect(sql).toBe(`${tableName}.b, ${tableName}.c`);
	});
	test("excludes object", () => {
		const sql = parseSelectedFields({
			tableName,
			fields,
			excludes: excludesObject,
		});

		expect(sql).toBe(`${tableName}.b, ${tableName}.c`);
	});
	test("count", () => {
		const sql = parseSelectedFields({ tableName, fields, count });

		expect(sql).toBe(`count(${tableName}.*) as h`);
	});
	test("object count", () => {
		const sql = parseSelectedFields({ tableName, fields, count: objectCount });

		expect(sql).toBe(`count((${tableName}.* = 15)) as h`);
	});
	test("count and includes", () => {
		const sql = parseSelectedFields({
			tableName,
			fields,
			count,
			includes: includesArray,
		});

		expect(sql).toBe(
			`${tableName}.a, ${tableName}.b, count(${tableName}.*) as h`
		);
	});
	test("count and excludes", () => {
		const sql = parseSelectedFields({
			tableName,
			fields,
			count,
			excludes: excludesArray,
		});

		expect(sql).toBe(
			`${tableName}.b, ${tableName}.c, count(${tableName}.*) as h`
		);
	});
});
