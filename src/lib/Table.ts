import { PoolConnection } from "mariadb";
import {
	TableConfig,
	SQL,
	TableFilters,
	AnyObject,
	TableSelectRequestConfig,
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
	parseSetParams,
	parseExcludes,
	parseIncludes,
	parseJoinTables,
	parseWhere,
	undefinedToNull,
} from "../utils";
import { parseOrdering, parseValues } from "../utils/queryParsers";
import { ParamsError } from "./Error";

export class Table<TF extends AnyObject> {
	private connection: PoolConnection | null;
	private readonly config: TableConfig<TF>;

	public constructor(config: TableConfig<TF>) {
		/* TODO: Разбить конфиг на несколько частей таблицы */
		this.config = config;
		this.connection = null;
		accumulateConfigs(config);
	}

	public async init(connection: PoolConnection) {
		this.connection = connection;

		const intiSQL: SQL = parseCreateTable(this.config);

		await this.connection?.query(intiSQL);
	}

	public async insert<Request extends Partial<TF> = Partial<TF>>(
		params: Request | Request[]
	) {
		const fields: SQL = parseSQLKeys(isArray(params) ? params[0] : params);
		/* TODO: Сделать рефактор с undefined to null */
		const values: SQL = parseValues(
			isArray(params) ? params.map(undefinedToNull) : [undefinedToNull(params)]
		);

		await this.connection?.query(
			`INSERT ${this.config.table}(${fields}) ${values};`
		);
	}

	// eslint-disable-next-line sonarjs/cognitive-complexity
	public async select<Response>(config: TableSelectRequestConfig<TF> = {}) {
		const {
			filters,
			join,
			excludes,
			includes,
			ordering,
			page = { page: 1, countOnPage: 100 },
		} = config;

		/* TODO: Сделать рефактор, шаблонизировать валидацию */
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

		if (ordering && !isObject(ordering)) {
			throw new ParamsError(
				"select",
				["ordering"],
				"if is transmitted must be an object"
			);
		}

		let select: SQL = "*";
		let where: SQL = "";
		let joinSQL: SQL = "";
		let orderBy: SQL = "";
		const tableFields: string[] = addPrefix(
			Object.keys(this.config.fields),
			this.config.table,
			"."
		);

		if (join && this.config.foreignKeys) {
			joinSQL = parseJoinTables(this.config.table, this.config.foreignKeys);
			/* TODO: перенести парсинг полей в конструктор и держать, как отдельное свойство */
			tableFields.push(...getJoinedFields(this.config.foreignKeys));
		}

		if (excludes && !isEmpty(excludes)) {
			select = parseExcludes(this.config.table, tableFields, excludes);
		}

		if (includes && !isEmpty(includes)) {
			select = parseIncludes(this.config.table, includes);
		}

		if (filters && !isEmpty(filters)) {
			where = parseWhere(
				undefinedToNull<typeof filters>(filters),
				this.config.table
			);
		}

		if (ordering && !isEmpty(ordering)) {
			orderBy = parseOrdering(undefinedToNull<typeof ordering>(ordering));
		}

		const limit = parseLimit(page);

		const response = await this.connection?.query(
			`SELECT ${select || "*"} FROM ${
				this.config.table
			} ${joinSQL} ${where} ${orderBy} ${limit};`
		);

		return Array.from<Response>(response);
	}

	public async selectOne<Response>(
		config: TableSelectRequestConfig<TF> = {}
	): Promise<Response | undefined> {
		return (await this.select<Response>(config))[0];
	}

	public async delete(filters: TableFilters<TF>) {
		if (isEmpty(filters)) {
			throw new ParamsError("select", ["filters"], "filters must not be empty");
		}

		const where: SQL = parseWhere(filters);

		await this.connection?.query(`DELETE FROM ${this.config.table} ${where};`);
	}

	public async update<Values extends AnyObject>(
		newValues: Values,
		filters: TableFilters<TF>
	) {
		if (isEmpty(filters)) {
			throw new ParamsError("select", ["filters"], "filters must not be empty");
		}

		if (isEmpty(newValues)) {
			throw new ParamsError(
				"select",
				["newValues"],
				"newValues must not be empty"
			);
		}

		const update: SQL = parseSetParams(newValues);
		const where: SQL = parseWhere(filters);

		await this.connection?.query(
			`UPDATE ${this.config.table} SET ${update} ${where};`
		);
	}

	public async truncate() {
		await this.connection?.query(`TRUNCATE TABLE ${this.config.table};`);
	}

	public async drop() {
		await this.connection?.query(`DROP TABLE ${this.config.table};`);
	}

	public async deleteAll() {
		await this.connection?.query(`DELETE FROM ${this.config.table};`);
	}
}
