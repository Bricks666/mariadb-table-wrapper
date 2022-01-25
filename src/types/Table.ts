import { AnyObject } from ".";

export interface TableConfig<TF extends AnyObject> {
	readonly table: string;
	readonly fields: Fields<TF>;
	readonly safeCreating?: boolean;
	readonly foreignKeys?: ForeignKeys<TF>;
}

export type Fields<TF> = {
	readonly [key in keyof TF]: FieldConfig;
};

export interface FieldConfig {
	readonly type: SQLTypes;
	readonly isAutoIncrement?: boolean;
	readonly isPrimaryKey?: boolean;
	readonly isUnique?: boolean;
	readonly isUnsigned?: boolean;
	readonly isNotNull?: boolean;

	readonly stringLen?: number;
	readonly enumSetValues?: string[];
}

export enum SQLTypes {
	/* NUMBERS */
	TINYINT = "TINYINT",
	SMALLINT = "SMALLINT",
	MEDIUMINT = "MEDIUMINT",
	INT = "INT",
	BIGINT = "BIGINT",
	DECIMAL = "DECIMAL",
	FLOAT = "FLOAT",
	DOUBLE = "DOUBLE",
	BOOLEAN = "BOOL",

	/* TEXT */
	VARCHAR = "VARCHAR",
	CHAR = "CHAR",
	TINYTEXT = "TINYTEXT",
	TEXT = "TEXT",
	MEDIUMTEXT = "MEDIUMTEXT",
	LARGETEXT = "LARGETEXT",

	/* DATE */
	DATE = "DATE",
	TIME = "TIME",
	DATETIME = "DATETIME",
	YEAR = "YEAR",
	TIMESTAMP = "TIMESTAMP",

	/* COMPLEX */
	ENUM = "ENUM",
	NULL = "NULL",
	SET = "SET",

	/* BIN */
	TINYBLOB = "TINYBLOB",
	BLOB = "BLOB",
	MEDIUMBLOB = "MEDIUMBLOB",
	LARGEBLOB = "LARGEBLOB",
}

export type ForeignKeys<TF extends AnyObject> = {
	readonly [key in keyof TF]?: Reference;
};

export interface Reference {
	readonly tableName: string;
	readonly field: string;
}
