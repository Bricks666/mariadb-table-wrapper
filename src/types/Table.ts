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
export interface Expression<TF extends AnyObject> {
	readonly field: keyof TF;
	readonly operator: Operators;
	readonly value: string | number | boolean;
}

export type TableFilters<TF extends AnyObject> = {
	readonly [key in keyof TF]?: TF[key] | TF[key][];
};

export type OrderingDirection = "DESC" | "ASC";

export type Ordering<TF extends AnyObject> = {
	readonly [key in keyof TF]?: OrderingDirection;
};

export type AssociateField<TF extends AnyObject> = [keyof TF, string];

export type ExcludeFields<TF extends AnyObject> = Array<keyof TF>;
export type IncludeFields<TF extends AnyObject> = Array<
	AssociateField<TF> | keyof TF
>;

export interface TableSelectRequestConfig<TF extends AnyObject> {
	readonly filters?: TableFilters<TF>;
	readonly join?: boolean;
	readonly page?: TablePage;
	readonly excludes?: ExcludeFields<TF>;
	readonly includes?: IncludeFields<TF>;
	readonly ordering?: Ordering<TF>;
}
