import { AnyObject } from ".";

export interface TableConfig<TF extends AnyObject> {
	readonly table: string;
	readonly fields: Fields<TF>;
	readonly safeCreating?: boolean;
	readonly foreignKeys?: ForeignKeys<TF>;
}

export type Fields<TF extends AnyObject> = {
	readonly [key in keyof TF]: FieldConfig<TF[key]>;
};

export interface FieldConfig<T extends ValidSQLType> {
	readonly type: SQLTypes;
	readonly isAutoIncrement?: boolean;
	readonly isPrimaryKey?: boolean;
	readonly isUnique?: boolean;
	readonly isUnsigned?: boolean;
	readonly isNotNull?: boolean;
	readonly check?: Expressions<T>;
	readonly default?: T;

	readonly stringLen?: number;
	readonly enumSetValues?: T[];
}

export type SQLTypes =
	/* NUMBERS */
	| "TINYINT"
	| "SMALLINT"
	| "MEDIUMINT"
	| "INT"
	| "BIGINT"
	| "DECIMAL"
	| "FLOAT"
	| "DOUBLE"
	| "BOOL"

	/* TEXT */
	| "VARCHAR"
	| "CHAR"
	| "TINYTEXT"
	| "TEXT"
	| "MEDIUMTEXT"
	| "LARGETEXT"

	/* DATE */
	| "DATE"
	| "TIME"
	| "DATETIME"
	| "YEAR"
	| "TIMESTAMP"

	/* COMPLEX */
	| "ENUM"
	| "NULL"
	| "SET"

	/* BIN */
	| "TINYBLOB"
	| "BLOB"
	| "MEDIUMBLOB"
	| "LARGEBLOB";

export type ForeignKeys<TF extends AnyObject> = {
	readonly [key in keyof TF]?: Reference;
};

export interface Reference {
	readonly tableName: string;
	readonly field: string;
	readonly onUpdate: ChangeType;
	readonly onDelete: ChangeType;
}
export type ChangeType =
	| "CASCADE"
	| "SET NULL"
	| "RESTRICT"
	| "NO ACTION"
	| "SET DEFAULT";

export type Expressions<T extends ValidSQLType> =
	| Expression<T>
	| Expression<T>[]
	| Expression<T>[][];

export interface Expression<T extends ValidSQLType> {
	readonly operator: Operators;
	readonly value?: T | T[];
	readonly not?: boolean;
	readonly template?: string;
}

export type ArithmeticOperators = "+" | "-" | "*" | "/";

export type Operators =
	| "="
	| "<"
	| "<="
	| ">"
	| ">="
	| "!="
	| "between"
	| "in"
	| "like"
	| "regExp"
	| "is null";

export type ValidSQLType = string | number;
