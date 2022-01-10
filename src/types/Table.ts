import { AnyObject } from ".";

export enum SQLTypes {
	SMALLINT = "SMALLINT",
	VARCHAR = "VARCHAR",
	DATE = "DATE",
	BOOLEAN = "BOOL",
}

export type Operators = "=" | "<" | "<=" | ">" | ">=" | "!=";

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
	readonly [key in keyof TF]?: Reference;
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
export interface Expression<T extends AnyObject> {
	field: keyof T;
	operator: Operators;
	value: string | number | boolean;
}

export type TableFilters<T extends AnyObject> = {
	readonly [key in keyof T]?:
		| T[key]
		| T[key][]
		| Expression<T>
		| Expression<T>[];
};

export type AssociateField<T extends AnyObject> = [keyof T, string];

export type ExcludeFields<T extends AnyObject> = Array<keyof T>;
export type IncludeFields<T extends AnyObject> = Array<
	AssociateField<T> | keyof T
>;

export interface TableSelectRequestConfig<T extends AnyObject> {
	readonly filters?: TableFilters<T>;
	readonly join?: boolean;
	readonly page?: TablePage;
	readonly excludes?: ExcludeFields<T>;
	readonly includes?: IncludeFields<T>;
}
