import { AnyObject } from ".";

export enum SQLTypes {
	SMALLINT = "SMALLINT",
	VARCHAR = "VARCHAR",
	DATE = "DATE",
	BOOLEAN = "BOOL",
}

export enum JoinOperators {
	LESS_THAN = "<",
	EQUAL = "=",
	MORE_THAN = ">",
}

export interface FieldConfig {
	readonly type: SQLTypes;
	readonly varcharLen?: number;
	readonly isPrimaryKey?: boolean;
	readonly isUnique?: boolean;
	readonly isUnsigned?: boolean;
	readonly isNotNull?: boolean;
	readonly isAutoIncrement?: boolean;
}

export type Fields<TF> = {
	readonly [key in keyof TF]: FieldConfig;
};
export interface Reference {
	readonly tableName: string;
	readonly field: string;
}

export type ForeignKeys<TF extends AnyObject> = {
	readonly [key in keyof TF]?: Reference | never;
};

export interface TableConfig<TF extends AnyObject> {
	readonly table: string;
	readonly fields: Fields<TF>;
	readonly safeCreating?: boolean;
	readonly foreignKeys?: ForeignKeys<TF>;
}
export interface TablePage {
	readonly page: number;
	readonly countOnPage: number;
}

export interface TableJoin {
	readonly outerTable: string;
	readonly innerTable: string;
	readonly expressions: JoinExpression[];
}
export interface JoinExpression {
	readonly innerField: `${string}Id`;
	readonly operator: JoinOperators;
	readonly outerField: `${string}Id`;
}

export type TableFilter<T extends AnyObject> = {
	readonly [key in keyof T]?: T[key] | T[key][];
};

export interface TableSelectRequestConfig<T extends AnyObject> {
	readonly filters?: TableFilter<T>;
	readonly join?: TableJoin[];
	readonly page?: TablePage;
	readonly includes?: (keyof T)[];
	readonly excludes?: (keyof T)[];
}
