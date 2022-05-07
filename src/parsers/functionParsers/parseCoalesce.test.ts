import { toJSON } from "@/utils";
import { parseCoalesce } from "./parseCoalesce";

const table = "test-table";
const field = "field";

describe("parseCoalesce", () => {
	test("one value", () => {
		const sql = parseCoalesce({
			type: "coalesce",
			values: [
				{
					table,
					value: field,
				},
			],
		});
		expect(sql).toBe(`COALESCE(${table}.${field})`);
	});
	test("one value and string", () => {
		const sql = parseCoalesce({
			type: "coalesce",
			values: [
				{
					table,
					value: field,
				},
				toJSON("string"),
			],
		});
		expect(sql).toBe(`COALESCE(${table}.${field}, "string")`);
	});
});
