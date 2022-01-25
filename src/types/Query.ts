import { AnyObject, MappedObject } from ".";

export interface TableSelectRequestConfig<TF extends AnyObject> {
	readonly filters?: TableFilters<TF>;
	readonly joinedTable?: JoinTable;
	readonly limit?: Limit;
	readonly excludes?: ExcludeFields<TF>;
	readonly includes?: IncludeFields<TF>;
	readonly orderBy?: OrderBy<TF>;
	/* TODO: Сделать счетчик */
	readonly count?: Count<TF>;
	readonly groupBy?: GroupBy<TF>;
}

export type TableFilters<TF extends AnyObject> = {
	readonly [key in keyof TF]?: TF[key] | TF[key][];
};

export interface JoinTable {
	readonly enable: boolean;
	readonly joinTable?: string[];
}

export interface Limit {
	readonly page: number;
	readonly countOnPage: number;
}
export type ExcludeFields<TF extends AnyObject> =
	| Array<keyof TF>
	| MappedObject<string[]>;

export type IncludeFields<TF extends AnyObject> =
	| Array<AssociateField<TF> | keyof TF>
	| MappedObject<Array<AssociateField<AnyObject> | string>>;

export type AssociateField<TF extends AnyObject, AdditionKeys = never> = [
	keyof TF | AdditionKeys,
	string
];

export type OrderBy<TF extends AnyObject> = {
	readonly [key in keyof TF]?: OrderDirection;
};

export type OrderDirection = "DESC" | "ASC";

export type GroupBy<TF extends AnyObject> =
	| Array<keyof TF>
	| MappedObject<string[]>;

export type Count<TF extends AnyObject> = Array<AssociateField<TF, "*">>;

export interface Expression<TF extends AnyObject> {
	readonly field: keyof TF;
	readonly operator: Operators;
	readonly value: string | number;
}

export type Operators = "=" | "<" | "<=" | ">" | ">=" | "!=";
