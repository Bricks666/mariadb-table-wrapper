import { AnyObject, MappedObject } from ".";

export interface TableSelectRequestConfig<TF extends AnyObject> {
	readonly filters?: TableFilters<TF>;
	readonly join?: boolean;
	readonly joinedTable?: string[];
	readonly page?: TablePage;
	readonly excludes?: ExcludeFields<TF>;
	readonly includes?: IncludeFields<TF>;
	readonly ordering?: Ordering<TF>;
	/* TODO: Сделать счетчик */
	readonly count?: never;
	/* TODO: Сделать группировку */
	readonly groupBy?: GroupBy<TF>;
}

export type TableFilters<TF extends AnyObject> = {
	readonly [key in keyof TF]?: TF[key] | TF[key][];
};

export interface TablePage {
	readonly page: number;
	readonly countOnPage: number;
}
export type ExcludeFields<TF extends AnyObject> =
	| Array<keyof TF>
	| MappedObject<string[]>;

export type IncludeFields<TF extends AnyObject> =
	| Array<AssociateField<TF> | keyof TF>
	| MappedObject<Array<AssociateField<AnyObject> | string>>;

export type AssociateField<TF extends AnyObject> = [keyof TF, string];

export type Ordering<TF extends AnyObject> = {
	readonly [key in keyof TF]?: OrderingDirection;
};

export type OrderingDirection = "DESC" | "ASC";

export type GroupBy<TF extends AnyObject> =
	| Array<keyof TF>
	| MappedObject<string[]>;

export interface Expression<TF extends AnyObject> {
	readonly field: keyof TF;
	readonly operator: Operators;
	readonly value: string | number;
}

export type Operators = "=" | "<" | "<=" | ">" | ">=" | "!=";
