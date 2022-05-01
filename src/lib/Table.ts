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
	toString,
} from "@/utils";
import {
	parseSelectedFields,
	parseQueryOptions,
	parseJoinTables,
	parseSQLKeys,
	parseSetParams,
	parseAlter,
	parseSQLValues,
} from "@/parsers/queryParsers";
import { parseCreateTable } from "@/parsers/tableParsers";

export class Table<TF extends AnyObject> {
	private connection: Connection | null;
	private readonly name: string;
	private readonly fields: Fields<TF>;
	private readonly foreignKeys: ForeignKeys<TF> | undefined;
	private readonly safeCreating: boolean;

	public constructor(config: TableConfig<TF>) {
		this.name = config.table;
		this.fields = config.fields;
		this.foreignKeys = config.foreignKeys;
		this.safeCreating = !!config.safeCreating;

		this.connection = null;

		accumulateConfigs(config);
	}

	public async init(connection: Connection) {
		this.connection = connection;

		const intiSQL: SQL = parseCreateTable({
			fields: this.fields,
			foreignKeys: this.foreignKeys,
			table: this.name,
			safeCreating: this.safeCreating,
		});
		await this.connection.query(intiSQL);
	}

	public async insert<Request extends Partial<TF> = Partial<TF>>(
		params: Request | Request[]
	) {
		const fields: SQL = parseSQLKeys(isArray(params) ? params[0] : params);

		const paramsArray = isArray(params) ? params : [params];
		const values: SQL = toString(
			paramsArray.map((param) => parseSQLValues(undefinedToNull(param)))
		);

		await this.request(
			"INSERT",
			this.name,
			`(${fields})`,
			"VALUES",
			`(${values})`
		);
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
		const fields: string[] = Object.keys(this.fields).map((field) =>
			addPrefix(field, this.name)
		);

		let joinSQL: SQL = "";

		if (joinedTable?.enable && this.foreignKeys) {
			joinSQL = parseJoinTables(
				this.name,
				this.foreignKeys,
				joinedTable.joinTable
			);
			fields.push(
				...getJoinedFields(
					this.foreignKeys,
					joinedTable.joinTable,
					joinedTable.recurseInclude
				)
			);
		}

		const select: SQL = parseSelectedFields({
			tableName: this.name,
			fields,
			excludes,
			includes,
			count,
		});

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

	public async selectOne<Response = TF>(
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

	public async update<Values extends Partial<TF>>(
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

	public async disconnect() {
		await this.connection?.end();
		this.connection = null;
	}

	private async request<R = unknown>(...options: string[]): Promise<R[]> {
		return Array.from(await this.connection?.query(`${options.join(" ")};`));
	}
}
