import { Connection } from "mariadb";
import { ParamsError } from "@/lib/Error";
import {
	TableConfig,
	SQL,
	AnyObject,
	SelectQuery,
	Fields,
	ForeignKeys,
	Query,
	AlterTableRequest,
	ValidSQLType,
	Description,
} from "@/types";
import {
	accumulateConfigs,
	addPrefix,
	getJoinedFields,
	isArray,
	isEmpty,
	undefinedToNull,
} from "@/utils";
import {
	parseValues,
	parseSelectedFields,
	parseQueryOptions,
	parseJoinTables,
	parseSQLKeys,
	parseSetParams,
	parseAlter,
} from "@/parsers/queryParsers";
import { parseCreateTable } from "@/parsers/tableParsers";

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

		await this.connection.query(intiSQL);
	}

	public async insert<Request extends Partial<TF> = Partial<TF>>(
		params: Request | Request[]
	) {
		const fields: SQL = parseSQLKeys(isArray(params) ? params[0] : params);

		const paramsArray = isArray(params) ? params : [params];
		const values: SQL = parseValues(paramsArray.map(undefinedToNull));

		await this.request("INSERT", this.name, `(${fields})`, values);
	}

	public async select<Response = TF>(
		config: SelectQuery<TF> = {}
	): Promise<Response[]> {
		const {
			filters,
			excludes,
			includes,
			orderBy,
			joinedTable,
			groupBy,
			count,
			distinct,
			limit = { page: 1, countOnPage: 100 },
		} = config;
		/* TODO:  Добавить проверки входных параметров */
		const tableFields: string[] = Object.keys(this.fields).map((field) =>
			addPrefix(field, this.name)
		);

		let joinSQL: SQL = "";

		if (joinedTable?.enable && this.foreignKeys) {
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

		const options: SQL = parseQueryOptions(this.name, {
			filters,
			groupBy,
			orderBy,
			limit,
		});

		return await this.request(
			"SELECT",
			distinct ? "DISTINCT" : "",
			select || "*",
			"FROM",
			this.name,
			joinSQL,
			options
		);
	}

	public async selectOne<Response>(
		config: SelectQuery<TF> = {}
	): Promise<Response | undefined> {
		return (
			await this.select<Response>({
				...config,
				limit: { page: 1, ...config.limit, countOnPage: 1 },
			})
		)[0];
	}

	public async delete(config?: Query<TF>) {
		let options = "";
		if (config) {
			options = parseQueryOptions(this.name, config);
		}

		await this.request("DELETE FROM", this.name, options);
	}

	public async update<Values extends TF>(
		newValues: Values,
		config?: Query<TF>
	) {
		if (isEmpty(newValues)) {
			throw new ParamsError(
				"select",
				["newValues"],
				"newValues must not be empty"
			);
		}

		const update: SQL = parseSetParams(newValues);

		let options = "";
		if (config) {
			options = parseQueryOptions(this.name, config);
		}

		await this.request("UPDATE", this.name, "SET", update, options);
	}

	public async truncate() {
		await this.request("TRUNCATE TABLE", this.name);
	}

	public async drop() {
		await this.request("DROP TABLE", this.name);
	}

	public async describe() {
		return await this.request<Description<TF>[]>("DESC", this.name);
	}

	public async alter<T extends ValidSQLType = ValidSQLType>(
		params: AlterTableRequest<T, TF>
	) {
		return await this.request(
			"ALTER TABLE",
			this.name,
			parseAlter(this.name, params)
		);
	}

	private async request<R = unknown>(...options: string[]): Promise<R[]> {
		return Array.from(await this.connection?.query(`${options.join(" ")};`));
	}
}
