import { AnyObject, ValidSQLType } from "./Common";
import { Expressions } from "./Table";

export type FunctionNames = "count" | "if" | "case" | "ifnull" | "coalesce";

export interface Function<T extends FunctionNames> {
	readonly type: T;
	readonly name?: string;
}

export interface Count<TF extends AnyObject> extends Function<"count"> {
	readonly body: keyof TF | If<TF>;
}

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
export interface CaseExpression<TF extends AnyObject> {
	readonly table: string;
	readonly field: keyof TF;
	readonly expression: Expressions<TF[this["field"]]>;
	readonly value: TF[this["field"]];
}

export interface Case<TF extends AnyObject> extends Function<"case"> {
	readonly cases: Array<CaseExpression<TF>>;
	readonly defaultValue?: ValidSQLType;
}

export interface CoalesceValue {
	readonly table: string;
	readonly value: string;
}

export interface Coalesce extends Function<"coalesce"> {
	readonly values: CoalesceValue[];
}

export type Functions<TF extends AnyObject> =
	| Count<TF>
	| If<TF>
	| Case<TF>
	| IfNull<TF>
	| Coalesce;
