import { AnyObject, TableConfig } from "@/types";
import { parseCreateTable } from "./parseCreateTable";

const type = "BIGINT";
const tableName = "test-table";
describe("parseCreateTable", () => {
	test("base config", () => {
		const config: TableConfig<AnyObject> = {
			table: tableName,
			fields: {
				a: {
					type,
				},
			},
		};
		const sql = parseCreateTable(config);

		expect(sql).toBe("test-table(a BIGINT)");
	});
	test("with exists", () => {
		const config: TableConfig<AnyObject> = {
			table: tableName,
			fields: {
				a: {
					type,
				},
			},
			safeCreating: true,
		};
		const sql = parseCreateTable(config);

		expect(sql).toBe("IF NOT EXISTS test-table(a BIGINT)");
	});
	test("with primary key", () => {
		const config: TableConfig<AnyObject> = {
			table: tableName,
			fields: {
				a: {
					type,
					isPrimaryKey: true,
				},
			},
			safeCreating: true,
		};
		const sql = parseCreateTable(config);

		expect(sql).toBe(
			"IF NOT EXISTS test-table(a BIGINT, CONSTRAINT test-table_pk PRIMARY KEY(a))"
		);
	});
	test("several fields with primary key", () => {
		const config: TableConfig<AnyObject> = {
			table: tableName,
			fields: {
				a: {
					type,
					isPrimaryKey: true,
				},
				b: {
					type: "BOOL",
				},
			},
			safeCreating: true,
		};
		const sql = parseCreateTable(config);

		expect(sql).toBe(
			"IF NOT EXISTS test-table(a BIGINT, b BOOL, CONSTRAINT test-table_pk PRIMARY KEY(a))"
		);
	});
	test("several fields with several primary key", () => {
		const config: TableConfig<AnyObject> = {
			table: tableName,
			fields: {
				a: {
					type,
					isPrimaryKey: true,
				},
				b: {
					type: "BOOL",
					isPrimaryKey: true,
				},
			},
			safeCreating: true,
		};
		const sql = parseCreateTable(config);

		expect(sql).toBe(
			"IF NOT EXISTS test-table(a BIGINT, b BOOL, CONSTRAINT test-table_pk PRIMARY KEY(a, b))"
		);
	});
	test("with foreign key", () => {
		const config: TableConfig<AnyObject> = {
			table: tableName,
			fields: {
				a: {
					type,
				},
			},
			safeCreating: true,
			foreignKeys: {
				a: {
					field: "a",
					tableName: "a",
				},
			},
		};
		const sql = parseCreateTable(config);

		expect(sql).toBe(
			"IF NOT EXISTS test-table(a BIGINT, CONSTRAINT test-table_a_fk FOREIGN KEY (a) REFERENCES a (a) ON DELETE CASCADE ON UPDATE CASCADE)"
		);
	});
});
