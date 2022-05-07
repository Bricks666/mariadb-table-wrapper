import { AnyObject, MappedObject } from "./Common";
import { ValidSQLType } from "./Common";
import { Functions } from "./Functions";
import { FieldConfig, Reference, Expressions } from "./Table";

export interface Query<TF extends AnyObject> {
	readonly filters?:
		| TableFilters<TF>
		| TableFilters<TF>[]
		| MappedObject<TableFilters<AnyObject> | TableFilters<AnyObject>[]>;
	readonly orderBy?: OrderBy<TF> /* | MappedObject<OrderBy<AnyObject>> */;
	readonly limit?: Limit;
	readonly groupBy?: GroupBy<TF> | MappedObject<GroupBy<AnyObject>>;
}

export interface SelectQuery<TF extends AnyObject> extends Query<TF> {
	readonly joinedTable?: JoinTable;
	readonly excludes?:
		| ExcludeFields<TF>
		| MappedObject<ExcludeFields<AnyObject>>;
	readonly includes?:
		| IncludeFields<TF>
		| MappedObject<IncludeFields<AnyObject>>;
	readonly functions?:
		| Array<Functions<TF>>
		| MappedObject<Array<Functions<TF>>>;
	readonly distinct?: boolean;
}

export type TableFilters<TF extends AnyObject> = {
	readonly [key in keyof TF]?: Expressions<TF[key]>;
};

export interface JoinTable {
	readonly enable: boolean;
	readonly joinTable?: Array<Join | string>;
	readonly recurseInclude?: boolean;
}
export type JoinType = "INNER" | "LEFT" | "RIGHT";

export interface Join {
	readonly table: string;
	readonly type?: JoinType;
	readonly invert?: boolean;
}

export interface Limit {
	readonly page: number;
	readonly countOnPage: number;
}
export type ExcludeFields<TF extends AnyObject> = Array<keyof TF>;

export type IncludeFields<TF extends AnyObject> = Array<
	AssociateField<TF, "*"> | keyof TF
>;

export type AssociateField<TF extends AnyObject, AdditionKeys = never> = [
	keyof TF | AdditionKeys,
	string
];

export type OrderBy<TF extends AnyObject> = {
	readonly [key in keyof TF]?: OrderDirection;
};

export type OrderDirection = "DESC" | "ASC";

export type GroupBy<TF extends AnyObject> = Array<keyof TF>;

export type AlterTableRequest<
	T extends ValidSQLType = ValidSQLType,
	TF extends AnyObject = AnyObject
> =
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
	"isPrimaryKey" | "default"
>;

export interface AddColumn<T extends ValidSQLType> {
	readonly type: "ADD COLUMN";
	readonly fieldName: string;
	readonly field: AlterFieldConfig<T>;
}

export interface DropColumn<TF extends AnyObject> {
	readonly type: "DROP COLUMN";
	readonly fieldName: keyof TF;
}

export interface ModifyColumn<TF extends AnyObject, T extends ValidSQLType> {
	readonly type: "MODIFY COLUMN";
	readonly fieldName: keyof TF;
	readonly field: AlterFieldConfig<T>;
}

export interface AlterColumn<TF extends AnyObject, T extends ValidSQLType> {
	readonly type: "ALTER COLUMN";
	readonly fieldName: keyof TF;
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

export interface Description<TF extends AnyObject> {
	readonly Field: keyof TF;
	readonly Type: string;
	readonly Null: "YES" | "NO";
	readonly Key: "PRI" | "";
	readonly Default: ValidSQLType | null;
	readonly Extra: string;
}
