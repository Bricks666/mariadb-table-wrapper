import { AnyObject, Count } from "@/types";
import { parseCount } from "./parseCount";

const table = "test-table";
const count: Count<AnyObject> = {
	type: "count",
	body: {
		type: "if",
		field: "field",
		condition: {
			operator: "=",
			value: 15,
		},
	},
};

describe("parseCount", () => {
	test("simple count", () => {
		expect(parseCount(table, { type: "count", body: "field" })).toBe(
			`count(${table}.field)`
		);
	});
	test("count with if", () => {
		expect(parseCount(table, count)).toBe(
			`count(IF((${table}.field = 15), ${table}.field, null))`
		);
	});
});
