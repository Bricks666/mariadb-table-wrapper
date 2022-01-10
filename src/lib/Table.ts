import { PoolConnection } from "mariadb";
import {
	TableConfig,
	SQL,
	TableFilter,
	AnyObject,
	TableSelectRequestConfig,
	ExcludeFields,
} from "../types";
import {
	accumulateConfigs,
	addPrefix,
	getJoinedFields,
	isArray,
	isEmpty,
	isObject,
	parseCreateTable,
	parseLimit,
	parseSQLKeys,
	parseSQLValues,
	parseSetParams,
	parseExcludes,
	parseIncludes,
	parseJoinTables,
	parseWhere,
} from "../utils";
import { ParamsError } from "./Error";

export class Table<TF extends AnyObject> {
	private connection: PoolConnection | null;
	private readonly config: TableConfig<TF>;

	public constructor(config: TableConfig<TF>) {
		this.config = config;
		this.connection = null;
		accumulateConfigs(config);
	}

	public async init(connection: PoolConnection) {
		this.connection = connection;

		const intiSQL: SQL = parseCreateTable(this.config);

		await this.connection?.query(intiSQL);
	}

	/* TODO: Добавить возможность множественного добавления */
	public async insert<Request extends Partial<TF>>(params: Request) {
		const fields: SQL = parseSQLKeys(params);
		const values: SQL = parseSQLValues(params);

		await this.connection?.query(
			`INSERT ${this.config.table}(${fields}) VALUES(${values});`
		);
	}

	// eslint-disable-next-line sonarjs/cognitive-complexity
	public async select<Response>(config: TableSelectRequestConfig<TF> = {}) {
		const {
			filters,
			join,
			excludes,
			includes,
			page = { page: 1, countOnPage: 100 },
		} = config;

		if (excludes && includes) {
			throw new ParamsError(
				"select",
				["excludes", "includes"],
				"were transmitted together"
			);
		}

		if (excludes && !isArray(excludes)) {
			throw new ParamsError(
				"select",
				["excludes"],
				"when is transmitted must be an array"
			);
		}

		if (includes && !isArray(includes)) {
			throw new ParamsError(
				"select",
				["includes"],
				"when is transmitted must be an array"
			);
		}

		if (filters && !isObject(filters)) {
			throw new ParamsError(
				"select",
				["filters"],
				"if is transmitted must be an object"
			);
		}

		let select: SQL = "*";
		let where: SQL = "";
		let joinSQL: SQL = "";
		const tableFields: string[] = addPrefix(
			Object.keys(this.config.fields),
			this.config.table,
			"."
		);

		if (join && this.config.foreignKeys) {
			joinSQL = parseJoinTables(this.config.table, this.config.foreignKeys);
			tableFields.push(
				...getJoinedFields(this.config.table, this.config.foreignKeys)
			);
		}

		if (excludes && !isEmpty(excludes)) {
			select = parseExcludes(this.config.table, tableFields, excludes);
		}

		if (includes && !isEmpty(includes)) {
			select = parseIncludes(this.config.table, includes);
		}

		if (filters && !isEmpty(filters)) {
			where = parseWhere(filters, this.config.table);
		}

		const limit = parseLimit(page);

		const response = await this.connection?.query(
			`SELECT ${select || "*"} FROM ${
				this.config.table
			} ${joinSQL} ${where} ${limit};`
		);

		return Array.from<Response>(response);
	}

	public async delete(filters: TableFilter<TF>) {
		if (isEmpty(filters)) {
			throw new Error("filters must have any property");
		}
		const where: SQL = parseWhere(filters);

		await this.connection?.query(`DELETE FROM ${this.config.table} ${where};`);
	}

	public async update<Values extends AnyObject>(
		newValues: Values,
		filters: TableFilter<TF>
	) {
		if (isEmpty(newValues) || isEmpty(filters)) {
			throw new Error("newValues and Filter must have any property");
		}

		const update: SQL = parseSetParams(newValues);
		const where: SQL = parseWhere(filters);

		await this.connection?.query(
			`UPDATE ${this.config.table} SET ${update} ${where};`
		);
	}
}
