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

	readonly varcharLen?: number;
	readonly enumValues?: string[];
}

export enum SQLTypes {
	SMALLINT = "SMALLINT",
	VARCHAR = "VARCHAR",
	DATE = "DATE",
	BOOLEAN = "BOOL",
	ENUM = "ENUM",
}

export type ForeignKeys<TF extends AnyObject> = {
	readonly [key in keyof TF]?: Reference;
};

export interface Reference {
	readonly tableName: string;
	readonly field: string;
}

export interface TableSelectRequestConfig<TF extends AnyObject> {
	readonly filters?: TableFilters<TF>;
	readonly join?: boolean;
	readonly joinedTable?: string[];
	readonly page?: TablePage;
	readonly excludes?: ExcludeFields<TF>;
	readonly includes?: IncludeFields<TF>;
	readonly ordering?: Ordering<TF>;
}

export type TableFilters<TF extends AnyObject> = {
	readonly [key in keyof TF]?: TF[key] | TF[key][];
};

export interface TablePage {
	readonly page: number;
	readonly countOnPage: number;
}

/* TODO: разделить массив и Joined */
export type ExcludeFields<TF extends AnyObject> =
	| Array<keyof TF>
	| JoinedExcludeFields;
export type IncludeFields<TF extends AnyObject> =
	| Array<AssociateField<TF> | keyof TF>
	| JoinedIncludeFields;

export type AssociateField<TF extends AnyObject> = [keyof TF, string];

export type JoinedExcludeFields = {
	readonly [key: string]: string[];
};

export type JoinedIncludeFields = {
	readonly [key: string]: Array<AssociateField<AnyObject> | string>;
};

export type Ordering<TF extends AnyObject> = {
	readonly [key in keyof TF]?: OrderingDirection;
};

export type OrderingDirection = "DESC" | "ASC";

export interface Expression<TF extends AnyObject> {
	readonly field: keyof TF;
	readonly operator: Operators;
	readonly value: string | number | boolean;
}

export type Operators = "=" | "<" | "<=" | ">" | ">=" | "!=";
