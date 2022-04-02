import { AnyObject, Expressions, MappedObject } from ".";
import { FieldConfig, Reference, ValidSQLType } from "./Table";

export interface Config<TF extends AnyObject> {
	readonly filters?: TableFilters<TF> | TableFilters<TF>[];
	readonly orderBy?: OrderBy<TF>;
	readonly limit?: Limit;
	readonly groupBy?: GroupBy<TF>;
}

export interface SelectConfig<TF extends AnyObject>
	extends Config<TF> {
	readonly joinedTable?: JoinTable;
	readonly excludes?: ExcludeFields<TF>;
	readonly includes?: IncludeFields<TF>;
	readonly count?: Count<TF> | MappedObject<Count<AnyObject>>;
	readonly distinct?: boolean;
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

export type AlterTableRequest<T extends ValidSQLType, TF extends AnyObject> =
	| AddColumn<T>
	| DropColumn<TF>
	| ModifyColumn<TF, T>
	| AlterColumn<TF, T>
	| AddForeignKey<TF>
	| DropForeignKey<TF>
	| AddPrimaryKey<TF>
	| DropPrimaryKey;

export type AlterFieldConfig<T extends ValidSQLType> = Omit<
	FieldConfig<T>,
	"isPrimaryKey"
>;

export interface AddColumn<T extends ValidSQLType> {
	readonly type: "ADD COLUMN";
	readonly fieldName: string;
	readonly field: AlterFieldConfig<T>;
}

export interface DropColumn<TF extends AnyObject> {
	readonly type: "DROP COLUMN";
	readonly column: keyof TF;
}

export interface ModifyColumn<TF extends AnyObject, T extends ValidSQLType> {
	readonly type: "MODIFY COLUMN";
	readonly fieldName: keyof TF;
	readonly field: AlterFieldConfig<T>;
}

export interface AlterColumn<TF extends AnyObject, T extends ValidSQLType> {
	readonly type: "ALTER COLUMN";
	readonly name: keyof TF;
	readonly default: T;
}

export interface AddForeignKey<TF extends AnyObject> {
	readonly type: "ADD FOREIGN KEY";
	readonly fieldName: keyof TF;
	readonly reference: Reference;
}

export interface DropForeignKey<TF extends AnyObject> {
	readonly type: "DROP FOREIGN KEY";
	readonly fieldName: keyof TF;
}

export interface AddPrimaryKey<TF extends AnyObject> {
	readonly type: "ADD PRIMARY KEY";
	readonly fieldNames: keyof TF[];
}
export interface DropPrimaryKey {
	readonly type: "DROP PRIMARY KEY";
}
