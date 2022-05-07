import { parseAggregateFunction } from "./parseAggregateFunction";

const type = "avg";
const body = "body";
const distinct = true;
const as = "as";

describe("parseAggregateFunction", () => {
	test("simple", () => {
		const sql = parseAggregateFunction(type, body);
		expect(sql).toBe(`${type.toUpperCase()}(${body})`);
	});
	test("with distinct", () => {
		const sql = parseAggregateFunction(type, body, distinct);
		expect(sql).toBe(`${type.toUpperCase()}(DISTINCT ${body})`);
	});
	test("name and distinct", () => {
		const sql = parseAggregateFunction(type, body, distinct, as);
		expect(sql).toBe(`${type.toUpperCase()}(DISTINCT ${body}) as ${as}`);
	});
});
