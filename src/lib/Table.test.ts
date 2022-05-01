/* eslint-disable sonarjs/no-duplicate-string */

import { CONFIGS_OBJECT } from "@/config";
import {
	parseAlter,
	parseQueryOptions,
	parseSetParams,
	parseSQLKeys,
	parseSQLValues,
	parseSelectedFields,
	parseJoinTables,
} from "@/parsers/queryParsers";
import { parseCreateTable } from "@/parsers/tableParsers";
import { TableConfig, AnyObject, AlterTableRequest } from "@/types";
import { Connection } from "mariadb";
import { toString, getJoinedFields } from "@/utils";
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

jest.mock("@/parsers/tableParsers");
jest.mock("@/parsers/queryParsers");
jest.mock("@/utils/toString");
jest.mock("@/utils/getJoinedFields", () => ({
	getJoinedFields: jest.fn(() => []),
}));
const config: TableConfig<AnyObject> = {
	fields: {},
	table: "a",
	foreignKeys: {},
	safeCreating: true,
};

let table = null as unknown as Table<AnyObject>;

beforeEach(() => {
	table = new Table(config);
});

describe("Table", () => {
	describe("constructor", () => {
		test("save need properties", () => {
			expect("name" in table).toBeTruthy();
			expect("fields" in table).toBeTruthy();
			expect("foreignKeys" in table).toBeTruthy();
			expect("safeCreating" in table).toBeTruthy();
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
			await table.init(connection);
		});
		test("call parseCreateTable", async () => {
			expect(parseCreateTable).toHaveBeenCalledTimes(1);
		});
		test("save connection", async () => {
			expect((table as AnyObject).connection).toBe(connection);
		});
		test("call query", async () => {
			expect(query).toHaveBeenCalledTimes(1);
		});
	});
	describe("insert()", () => {
		beforeEach(async () => {
			await table.init(connection);
		});
		test("parseSQLKeys()", async () => {
			await table.insert({});
			expect(parseSQLKeys).toHaveBeenCalledTimes(1);
		});
		test("parseSQLValues", async () => {
			await table.insert({});
			expect(parseSQLValues).toHaveBeenCalledTimes(1);
			expect(toString).toHaveBeenCalledTimes(1);
		});
		test("was request", async () => {
			(Table.prototype as AnyObject).request = jest.fn();
			await table.insert({});
			expect((Table.prototype as AnyObject).request).toHaveBeenCalledTimes(1);
		});
	});
	describe("describe()", () => {
		beforeEach(async () => {
			await table.init(connection);
		});
		test("was request", async () => {
			(Table.prototype as AnyObject).request = jest.fn();
			await table.describe();
			expect((Table.prototype as AnyObject).request).toHaveBeenCalledTimes(1);
			expect((Table.prototype as AnyObject).request).toHaveBeenLastCalledWith(
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
			(Table.prototype as AnyObject).request = jest.fn();
			await table.drop();
			expect((Table.prototype as AnyObject).request).toHaveBeenCalledTimes(1);
			expect((Table.prototype as AnyObject).request).toHaveBeenCalledWith(
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
			(Table.prototype as AnyObject).request = jest.fn();
			await table.truncate();
			expect((Table.prototype as AnyObject).request).toHaveBeenCalledTimes(1);
			expect((Table.prototype as AnyObject).request).toHaveBeenCalledWith(
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
		test("parseAlter()", async () => {
			await table.alter(alter);
			expect(parseAlter).toHaveBeenCalledTimes(1);
		});
		test("was request", async () => {
			(Table.prototype as AnyObject).request = jest.fn();
			await table.alter(alter);
			expect((Table.prototype as AnyObject).request).toHaveBeenCalledTimes(1);
		});
	});
	describe("update()", () => {
		const newValue = { a: "a" };
		beforeEach(async () => {
			await table.init(connection);
		});
		test("parseSetParams()", async () => {
			await table.update(newValue);
			expect(parseSetParams).toHaveBeenCalledTimes(1);
		});
		test("parseQueryOptions()", async () => {
			await table.update(newValue, {});
			expect(parseQueryOptions).toHaveBeenCalledTimes(1);
		});
		test("was request", async () => {
			(Table.prototype as AnyObject).request = jest.fn();
			await table.update(newValue);
			expect((Table.prototype as AnyObject).request).toHaveBeenCalledTimes(1);
		});
	});
	describe("delete()", () => {
		beforeEach(async () => {
			await table.init(connection);
		});
		test("parseQueryOptions()", async () => {
			await table.delete({});
			expect(parseQueryOptions).toHaveBeenCalledTimes(1);
		});
		test("was request", async () => {
			(Table.prototype as AnyObject).request = jest.fn();
			await table.delete({});
			expect((Table.prototype as AnyObject).request).toHaveBeenCalledTimes(1);
		});
	});
	describe("select()", () => {
		beforeEach(async () => {
			await table.init(connection);
		});
		test("parseSelectedFields()", async () => {
			await table.select({});
			expect(parseSelectedFields).toHaveBeenCalledTimes(1);
		});
		test("parseQueryOptions()", async () => {
			await table.select({});
			expect(parseQueryOptions).toHaveBeenCalledTimes(1);
		});
		test("parseJoinTables()", async () => {
			await table.select({ joinedTable: { enable: true } });
			expect(parseJoinTables).toHaveBeenCalledTimes(1);
		});
		test("getJoinedFields()", async () => {
			await table.select({ joinedTable: { enable: true } });
			expect(getJoinedFields).toHaveBeenCalledTimes(1);
		});
		test("was request", async () => {
			(Table.prototype as AnyObject).request = jest.fn();
			await table.select({});
			expect((Table.prototype as AnyObject).request).toHaveBeenCalledTimes(1);
		});
	});
	describe("selectOne()", () => {
		beforeEach(async () => {
			await table.init(connection);
		});
		test("was select", async () => {
			Table.prototype.select = jest.fn(async () => []);
			await table.selectOne({});
			expect(Table.prototype.select).toHaveBeenCalledTimes(1);
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
