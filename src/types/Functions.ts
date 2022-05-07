import { AnyObject, ValidSQLType } from "./Common";
import { Expressions } from "./Table";

export type AggregateFunctionNames = "count" | "max" | "min" | "avg" | "sum";
export type LogicFunctionNames = "if" | "case" | "ifnull" | "coalesce";

export type FunctionNames = AggregateFunctionNames | LogicFunctionNames;

export interface Function<T extends FunctionNames> {
	readonly type: T;
	readonly name?: string;
}

export interface AggregateFunction<T extends FunctionNames>
	extends Function<T> {
	readonly distinct?: boolean;
}
// Aggregate Functions

export interface Count<TF extends AnyObject>
	extends AggregateFunction<"count"> {
	readonly body: keyof TF | LogicFunctions<TF>;
}

export interface Max<TF extends AnyObject> extends AggregateFunction<"max"> {
	readonly field: keyof TF;
}
export interface Min<TF extends AnyObject> extends AggregateFunction<"min"> {
	readonly field: keyof TF;
}
export interface Avg<TF extends AnyObject> extends AggregateFunction<"avg"> {
	readonly field: keyof TF;
}
export interface Sum<TF extends AnyObject> extends AggregateFunction<"sum"> {
	readonly field: keyof TF;
}

export type AggregateFunctions<TF extends AnyObject> =
	| Count<TF>
	| Max<TF>
	| Min<TF>
	| Avg<TF>
	| Sum<TF>;

// Logic Functions
export interface IfNull<TF extends AnyObject> extends Function<"ifnull"> {
	readonly field: keyof TF;
	readonly no: TF[this["field"]];
}

export interface If<TF extends AnyObject> extends Function<"if"> {
	readonly field: keyof TF;
	readonly condition: Expressions<TF[this["field"]]>;
	readonly yes?: ValidSQLType;
	readonly no?: ValidSQLType;
}
/** TODO: Пересмотреть надобность дженериков */
/** TODO: Добавить функции для использования в запросе */
export interface CaseExpression {
	readonly table: string;
	readonly field: string;
	readonly expression: Expressions<ValidSQLType>;
	readonly value: ValidSQLType;
}

export interface Case extends Function<"case"> {
	readonly cases: Array<CaseExpression>;
	readonly defaultValue?: ValidSQLType;
}

export interface CoalesceValue {
	readonly table: string;
	readonly value: string;
}

export interface Coalesce extends Function<"coalesce"> {
	readonly values: Array<CoalesceValue | string>;
}

export type LogicFunctions<TF extends AnyObject> =
	| IfNull<TF>
	| If<TF>
	| Case
	| Coalesce;

export type Functions<TF extends AnyObject> =
	| AggregateFunctions<TF>
	| LogicFunctions<TF>;
