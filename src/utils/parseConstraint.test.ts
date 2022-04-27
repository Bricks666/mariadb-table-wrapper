import { parseConstraint } from "./parseConstraint";

const constraint = "CONSTRAINT";
const tableName = "test-table";
const fieldName = "test-field";

describe("parseConstraint", () => {
	test("foreign key", () => {
		const sql = parseConstraint(tableName, fieldName, "fk");
		expect(sql).toBe(`${constraint} ${tableName}_${fieldName}_fk`);
	});
	test("primary key", () => {
		const sql = parseConstraint(tableName, "", "pk");
		expect(sql).toBe(`${constraint} ${tableName}_pk`);
	});
	test("without prefix", () => {
		const sql = parseConstraint(tableName, "", "");
		expect(sql).toBe(`${constraint} ${tableName}`);
	});
});
