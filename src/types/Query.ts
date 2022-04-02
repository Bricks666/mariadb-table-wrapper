import { AnyObject, Expressions, MappedObject } from ".";

export interface QueryConfig<TF extends AnyObject> {
	readonly filters?: TableFilters<TF> | TableFilters<TF>[];
	readonly orderBy?: OrderBy<TF>;
	readonly limit?: Limit;
	readonly groupBy?: GroupBy<TF>;
}

export interface SelectQueryConfig<TF extends AnyObject>
	extends QueryConfig<TF> {
	readonly joinedTable?: JoinTable;
	readonly excludes?: ExcludeFields<TF>;
	readonly includes?: IncludeFields<TF>;
	readonly count?: Count<TF> | MappedObject<Count<AnyObject>>;
}

export type TableFilters<TF extends AnyObject> = {
	readonly [key in keyof TF]?: Expressions<TF[key]>;
} & { readonly exists?: boolean };

export interface JoinTable {
	readonly enable: boolean;
	readonly joinTable?: Array<Join | string>;
	readonly recurseInclude?: boolean;
}
export interface Join {
	readonly table: string;
	readonly invert?: boolean;
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
