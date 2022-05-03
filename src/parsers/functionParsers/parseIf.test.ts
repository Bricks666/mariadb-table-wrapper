import { parseIf } from "./parseIf";

const table = "test-table";

describe("parseIf", () => {
	test("without yes and no", () => {
		const sql = parseIf(table, {
			type: "if",
			field: "field",
			condition: {
				operator: "=",
				value: 15,
			},
		});

		expect(sql).toBe(`IF((${table}.field = 15), ${table}.field, null)`);
	});
	test("without no", () => {
		const sql = parseIf(table, {
			type: "if",
			field: "field",
			condition: {
				operator: "=",
				value: 15,
			},
			yes: 15,
		});

		expect(sql).toBe(`IF((${table}.field = 15), 15, null)`);
	});
	test("without yes", () => {
		const sql = parseIf(table, {
			type: "if",
			field: "field",
			condition: {
				operator: "=",
				value: 15,
			},
			no: 15,
		});

		expect(sql).toBe(`IF((${table}.field = 15), ${table}.field, 15)`);
	});
	test("full if", () => {
		const sql = parseIf(table, {
			type: "if",
			field: "field",
			condition: {
				operator: "=",
				value: 15,
			},
			yes: 15,
			no: 10,
		});

		expect(sql).toBe(`IF((${table}.field = 15), 15, 10)`);
	});
	test("with name", () => {
		const sql = parseIf(table, {
			type: "if",
			field: "field",
			condition: {
				operator: "=",
				value: 15,
			},
			name: "asas",
		});

		expect(sql).toBe(`IF((${table}.field = 15), ${table}.field, null) as asas`);
	});
});
