import { parseAlter } from "./parseAlter";

const tableName = "test-table";

describe("parseAlter", () => {
	test("parse ADD COLUMN REQUEST", () => {
		const sql = parseAlter(tableName, {
			type: "ADD COLUMN",
			fieldName: "users",
			field: {
				type: "BIGINT",
			},
		});

		expect(sql).toEqual("ADD COLUMN users BIGINT");
	});
});
