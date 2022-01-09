import { PoolConnection } from "mariadb";
import {
	TableConfig,
	SQL,
	TableFilter,
	AnyObject,
	TableSelectRequestConfig,
} from "../../types";
import {
	parseCreateTable,
	parseSQLKeys,
	parseSQLValues,
	parseJoinTables,
	parseWhere,
	parseSetParams,
	isEmptyObject,
	parseExcludes,
	parseIncludes,
} from "../../utils";

export class Table<TF extends AnyObject> {
	private connection: PoolConnection | null;

	public constructor(private readonly config: TableConfig<TF>) {
		this.connection = null;
	}

	public async init(connection: PoolConnection) {
		this.connection = connection;

		const intiSQL: SQL = parseCreateTable(this.config);

		await this.connection?.query(intiSQL);
	}

	public async insertData<Request extends Partial<TF>>(params: Request) {
		const fields: SQL = parseSQLKeys(params);
		const values: SQL = parseSQLValues(params);

		return await this.connection?.query(
			`INSERT ${this.config.table}(${fields}) VALUES(${values});`
		);
	}

	/* TODO: Добавить возможность исключать некоторые поля */
	public async selectData<Response>(config: TableSelectRequestConfig<TF> = {}) {
		const {
			filters,
			join,
			excludes,
			includes,
			page = { page: 1, countOnPage: 100 },
		} = config;

		if (excludes && includes) {
			throw new Error("You can't pass includes and excludes");
		}

		let where: SQL = "";
		let association: SQL = "";
		let excludesSQL: SQL = "";
		let includesSQL: SQL = "";

		if (typeof excludes !== "undefined") {
			excludesSQL = parseExcludes(this.config.fields, excludes);
		}

		if (typeof includes !== "undefined") {
			includesSQL = parseIncludes(includes);
		}

		if (typeof filters !== "undefined") {
			where = parseWhere(filters);
		}

		if (typeof join !== "undefined") {
			association = parseJoinTables(join);
		}

		const start = (page.page - 1) * page.countOnPage;
		const end = page.page * page.countOnPage;

		const response = await this.connection?.query(
			`SELECT ${includesSQL || excludesSQL || "*"} FROM ${
				this.config.table
			} ${where} ${association} LIMIT ${start}, ${end};`
		);

		return Array.from<Response>(response);
	}

	public async deleteData(filters: TableFilter<TF>) {
		if (Object.getOwnPropertyNames(filters).length === 0) {
			throw new Error("filters must have any property");
		}
		const where: SQL = parseWhere(filters);

		await this.connection?.query(`DELETE FROM ${this.config.table} ${where};`);
	}

	public async updateData<Values extends object>(
		newValues: Values,
		filters: TableFilter<TF>
	) {
		if (isEmptyObject(newValues) || isEmptyObject(filters)) {
			throw new Error("newValues and Filter must have any property");
		}

		const update: SQL = parseSetParams(newValues);
		const where: SQL = parseWhere(filters);

		await this.connection?.query(
			`UPDATE ${this.config.table} SET ${update} ${where};`
		);
	}
}
