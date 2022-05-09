// eslint-disable @typescript-eslint/no-explicit-any
import { parseAlter } from "./parseAlter";

const tableName = "test-table";
const fieldName = "test-field";

describe("parseAlter", () => {
	test("parse ADD COLUMN REQUEST", () => {
		const sql = parseAlter(tableName, {
			type: "ADD COLUMN",
			fieldName: fieldName,
			field: {
				type: "BIGINT",
			},
		});

		expect(sql).toEqual(`ADD COLUMN ${fieldName} BIGINT`);
	});
	test("parse ALTER COLUMN REQUEST", () => {
		const sql = parseAlter(tableName, {
			type: "ALTER COLUMN",
			fieldName: fieldName,
			default: 5,
		});

		expect(sql).toEqual(`ALTER COLUMN ${fieldName} SET DEFAULT 5`);
	});
	test("parse DROP COLUMN REQUEST", () => {
		const sql = parseAlter(tableName, {
			type: "DROP COLUMN",
			fieldName: fieldName,
		});

		expect(sql).toEqual(`DROP COLUMN ${fieldName}`);
	});
	test("parse MODIFY COLUMN REQUEST", () => {
		const sql = parseAlter(tableName, {
			type: "MODIFY COLUMN",
			fieldName: fieldName,
			field: {
				type: "BIGINT",
				isNotNull: true,
			},
		});

		expect(sql).toEqual(`MODIFY COLUMN ${fieldName} BIGINT NOT NULL`);
	});
	test("parse ADD FOREIGN KEY REQUEST", () => {
		const sql = parseAlter(tableName, {
			type: "ADD FOREIGN KEY",
			fieldName: fieldName,
			reference: {
				tableName: tableName,
				field: fieldName,
			},
		});

		expect(sql).toEqual(
			`ADD FOREIGN KEY CONSTRAINT ${tableName}_${fieldName}_fk FOREIGN KEY (${fieldName}) REFERENCES ${tableName} (${fieldName}) ON DELETE CASCADE ON UPDATE CASCADE`
		);
	});
	test("parse DROP FOREIGN KEY REQUEST", () => {
		const sql = parseAlter(tableName, {
			type: "DROP FOREIGN KEY",
			fieldName: fieldName,
		});

		expect(sql).toEqual(
			`DROP FOREIGN KEY CONSTRAINT ${tableName}_${fieldName}_fk DROP INDEX ${fieldName}`
		);
	});
	test("parse ADD PRIMARY KEY REQUEST", () => {
		const sql = parseAlter(tableName, {
			type: "ADD PRIMARY KEY",
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			fieldNames: [fieldName] as any,
		});

		expect(sql).toEqual(
			`ADD PRIMARY KEY CONSTRAINT ${tableName}_pk PRIMARY KEY(${fieldName})`
		);
	});
	test("parse DROP PRIMARY KEY REQUEST", () => {
		const sql = parseAlter(tableName, {
			type: "DROP PRIMARY KEY",
		});

		expect(sql).toEqual("DROP PRIMARY KEY");
	});
});
