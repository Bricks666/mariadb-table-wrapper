import { parseFunction } from "./parseFunction";

const type = "max";
const body = "body";
const as = "name";

describe("parseFunction", () => {
	test("function", () => {
		const sql = parseFunction(type, body);
		expect(sql).toBe(`${type.toUpperCase()}(${body})`);
	});
	test("function with name", () => {
		const sql = parseFunction(type, body, as);
		expect(sql).toBe(`${type.toUpperCase()}(${body}) as ${as}`);
	});
});
