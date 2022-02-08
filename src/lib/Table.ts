import { Connection } from "mariadb";
import {
	TableConfig,
	SQL,
	TableFilters,
	AnyObject,
	TableSelectRequestConfig,
	Fields,
	ForeignKeys,
} from "../types";
import {
	accumulateConfigs,
	addPrefix,
	getJoinedFields,
	isArray,
	isEmpty,
	parseCreateTable,
	parseSQLKeys,
	parseSetParams,
	parseWhere,
	undefinedToNull,
} from "../utils";
import {
	parseValues,
	parseSelectedFields,
	parseSelectOptions,
	parseJoinTables,
} from "../utils/queryParsers";
import { ParamsError } from "./Error";

export class Table<TF extends AnyObject> {
	private connection: Connection | null;
	private readonly name: string;
	private readonly fields: Fields<TF>;
	private readonly foreignKeys: ForeignKeys<TF> | undefined;
	private readonly safeCreation: boolean;

	public constructor(config: TableConfig<TF>) {
		this.name = config.table;
		this.fields = config.fields;
		this.foreignKeys = config.foreignKeys;
		this.safeCreation = !!config.safeCreating;

		this.connection = null;

		accumulateConfigs(config);
	}

	public async init(connection: Connection) {
		this.connection = connection;

		const intiSQL: SQL = parseCreateTable(
			this.name,
			this.fields,
			this.safeCreation,
			this.foreignKeys
		);

		await this.connection?.query(intiSQL);
	}

	public async insert<Request extends Partial<TF> = Partial<TF>>(
		params: Request | Request[]
	) {
		const fields: SQL = parseSQLKeys(isArray(params) ? params[0] : params);

		const paramsArray = isArray(params) ? params : [params];
		const values: SQL = parseValues(paramsArray.map(undefinedToNull));

		await this.connection?.query(`INSERT ${this.name}(${fields}) ${values};`);
	}

	/* TODO: Сгруппировать свойства и вынести их парсинг в отдельные функции  */
	public async select<Response = TF>(
		config: TableSelectRequestConfig<TF> = {}
	) {
		const {
			filters,
			excludes,
			includes,
			orderBy,
			joinedTable,
			groupBy,
			count,
			limit = { page: 1, countOnPage: 100 },
		} = config;
		/* TODO:  Добавить проверки входных параметров */
		const tableFields: string[] = Object.keys(this.fields).map((field) =>
			addPrefix(field, this.name)
		);

		let joinSQL: SQL = "";

		if (joinedTable?.enable && this.foreignKeys) {
			/* TODO: перенести парсинг полей в конструктор и держать, как отдельное свойство */
			joinSQL = parseJoinTables(
				this.name,
				this.foreignKeys,
				joinedTable.joinTable
			);
			tableFields.push(
				...getJoinedFields(
					this.foreignKeys,
					joinedTable.joinTable,
					joinedTable.recurseInclude
				)
			);
		}

		const select: SQL = parseSelectedFields(
			this.name,
			tableFields,
			excludes,
			includes,
			count
		);

		const options: SQL = parseSelectOptions(
			this.name,
			filters,
			groupBy,
			orderBy,
			limit
		);

		const response = await this.connection?.query(
			`SELECT ${select || "*"} FROM ${this.name} ${joinSQL} ${options};`
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

		await this.connection?.query(`DELETE FROM ${this.name} ${where};`);
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

		await this.connection?.query(`UPDATE ${this.name} SET ${update} ${where};`);
	}

	public async truncate() {
		await this.connection?.query(`TRUNCATE TABLE ${this.name};`);
	}

	public async drop() {
		await this.connection?.query(`DROP TABLE ${this.name};`);
	}

	public async deleteAll() {
		await this.connection?.query(`DELETE FROM ${this.name};`);
	}
}
