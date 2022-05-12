/* eslint-disable sonarjs/no-duplicate-string */
import { CONFIGS_OBJECT } from "@/config";
import {
	TableConfig,
	AnyObject,
	AlterTableRequest,
	SelectQuery,
} from "@/types";
import { Connection } from "mariadb";
import { Table } from "./Table";
/**
 * TODO: Написать нормальные тесты, что будут проверять параметры, вызываемый при запросе
 */
const query = jest.fn(async () => []);
const end = jest.fn(async () => true);
const connection = {
	end,
	query,
} as unknown as Connection;

const config: TableConfig<AnyObject> = {
	table: "a",
	fields: {
		field: {
			type: "BIGINT",
			isNotNull: true,
		},
	},
	foreignKeys: {
		field: {
			field: "fieldA",
			tableName: "tableA",
		},
	},
	safeCreating: true,
};

let table = null as unknown as Table<AnyObject>;

beforeEach(() => {
	table = new Table(config);
});

describe("Table", () => {
	describe("constructor", () => {
		test("save need properties", () => {
			expect(table.name).toBe(config.table);
			expect(table.fields).toBe(config.fields);
			expect(table.foreignKeys).toBe(config.foreignKeys);
			expect(table.safeCreating).toBe(config.safeCreating);
			expect((table as AnyObject).connection).toBeNull();
		});
		test("accumulateConfig", () => {
			jest.mock("@/config", () => ({
				CONFIGS_OBJECT: {},
			}));
			expect(CONFIGS_OBJECT["a"]).toEqual(config);
		});
	});
	describe("init()", () => {
		beforeEach(async () => {
			Table.prototype.request = jest.fn();
			await table.init(connection);
		});
		test("save connection", async () => {
			expect((table as AnyObject).connection).toBe(connection);
		});
		test("call query", async () => {
			expect(table.request).toHaveBeenCalledTimes(1);
			expect(table.request).toHaveBeenCalledWith(
				"CREATE TABLE",
				`IF NOT EXISTS ${config.table}(field BIGINT NOT NULL, CONSTRAINT a_field_fk FOREIGN KEY (field) REFERENCES tableA (fieldA) ON DELETE CASCADE ON UPDATE CASCADE)`
			);
		});
	});
	describe("insert()", () => {
		const insert = {
			field: 15,
		};
		beforeEach(async () => {
			await table.init(connection);
		});
		test("was request", async () => {
			Table.prototype.request = jest.fn();
			await table.insert(insert);
			expect(Table.prototype.request).toHaveBeenCalledTimes(1);
			expect(Table.prototype.request).toHaveBeenCalledWith(
				"INSERT",
				config.table,
				"(field)",
				"VALUES",
				`(${insert.field})`
			);
		});
	});
	describe("describe()", () => {
		beforeEach(async () => {
			await table.init(connection);
		});
		test("was request", async () => {
			Table.prototype.request = jest.fn();
			await table.describe();
			expect(Table.prototype.request).toHaveBeenCalledTimes(1);
			expect(Table.prototype.request).toHaveBeenLastCalledWith(
				"DESC",
				config.table
			);
		});
	});
	describe("drop()", () => {
		beforeEach(async () => {
			await table.init(connection);
		});
		test("was request", async () => {
			Table.prototype.request = jest.fn();
			await table.drop();
			expect(Table.prototype.request).toHaveBeenCalledTimes(1);
			expect(Table.prototype.request).toHaveBeenCalledWith(
				"DROP TABLE",
				config.table
			);
		});
	});
	describe("truncate()", () => {
		beforeEach(async () => {
			await table.init(connection);
		});
		test("was request", async () => {
			Table.prototype.request = jest.fn();
			await table.truncate();
			expect(Table.prototype.request).toHaveBeenCalledTimes(1);
			expect(Table.prototype.request).toHaveBeenCalledWith(
				"TRUNCATE TABLE",
				config.table
			);
		});
	});
	describe("alter()", () => {
		const alter: AlterTableRequest = {
			type: "DROP PRIMARY KEY",
		};
		beforeEach(async () => {
			await table.init(connection);
		});
		test("was request", async () => {
			Table.prototype.request = jest.fn();
			await table.alter(alter);
			expect(Table.prototype.request).toHaveBeenCalledTimes(1);
			expect(Table.prototype.request).toHaveBeenCalledWith(
				"ALTER TABLE",
				config.table,
				"DROP PRIMARY KEY"
			);
		});
	});
	describe("update()", () => {
		const newValue = { a: "a" };
		beforeEach(async () => {
			await table.init(connection);
		});
		test("was request", async () => {
			Table.prototype.request = jest.fn();
			await table.update(newValue);
			expect(Table.prototype.request).toHaveBeenCalledTimes(1);
			expect(Table.prototype.request).toHaveBeenCalledWith(
				"UPDATE",
				config.table,
				"SET",
				"a = \"a\"",
				""
			);
		});
	});
	describe("delete()", () => {
		beforeEach(async () => {
			await table.init(connection);
		});
		test("was request", async () => {
			Table.prototype.request = jest.fn();
			await table.delete({});
			expect(Table.prototype.request).toHaveBeenCalledTimes(1);
			expect(Table.prototype.request).toHaveBeenCalledWith(
				"DELETE FROM",
				config.table,
				""
			);
		});
	});
	describe("select()", () => {
		const select: SelectQuery<AnyObject> = {
			distinct: true,
			filters: {
				field: {
					operator: "=",
					value: 15,
				},
			},
			orderBy: {
				field: "ASC",
			},
		};
		beforeEach(async () => {
			await table.init(connection);
		});
		test("was request", async () => {
			Table.prototype.request = jest.fn();
			await table.select(select);
			expect(Table.prototype.request).toHaveBeenCalledTimes(1);
			expect(Table.prototype.request).toHaveBeenCalledWith(
				`SELECT DISTINCT * FROM ${config.table} WHERE (${config.table}.field = 15) ORDER BY ${config.table}.field ASC`
			);
		});
	});
	describe("selectOne()", () => {
		const select: SelectQuery<AnyObject> = {
			filters: {
				field: [
					{
						operator: "=",
						value: 15,
					},
					{
						operator: "!=",
						value: 15,
					},
				],
			},
			includes: ["*", { type: "max", field: "field", distinct: true }],
		};
		beforeEach(async () => {
			await table.init(connection);
		});
		test("was select", async () => {
			Table.prototype.request = jest.fn(async () => []);
			await table.selectOne(select);
			expect(Table.prototype.request).toHaveBeenCalledTimes(1);
			expect(Table.prototype.request).toHaveBeenCalledWith(
				`SELECT ${config.table}.*, MAX(DISTINCT ${config.table}.field) FROM ${config.table} WHERE (${config.table}.field = 15 AND ${config.table}.field != 15) LIMIT 0,1`
			);
		});
	});
	describe("disconnect()", () => {
		beforeEach(async () => {
			await table.init(connection);
		});
		test("disconnect()", async () => {
			await table.disconnect();
			expect((table as AnyObject).connection).toBeNull();
		});
	});
});
