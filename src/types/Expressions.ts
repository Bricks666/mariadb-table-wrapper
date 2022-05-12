import { ValidSQLType } from "./Common";
import { SubQuery } from "./Query";

export type Expressions = Expression | Expression[] | Expression[][];

export interface BaseExpression<Operator extends Operators> {
	readonly operator: Operator;
	readonly not?: boolean;
}

export interface LogicExpression
	extends BaseExpression<"=" | "!=" | "<" | ">" | ">=" | "<="> {
	readonly value: SubQuery | ValidSQLType;
}
export interface IsNullExpression extends BaseExpression<"is null"> {
	readonly value: never;
}
export interface GroupExpression extends BaseExpression<"between" | "in"> {
	readonly value: Array<SubQuery | ValidSQLType>;
}
export interface StringExpression extends BaseExpression<"like" | "regExp"> {
	readonly value: string;
}

export type Expression =
	| LogicExpression
	| IsNullExpression
	| GroupExpression
	| StringExpression;

export type Operators =
	| "="
	| "<"
	| "<="
	| ">"
	| ">="
	| "!="
	| "between"
	| "in"
	| "like"
	| "regExp"
	| "is null";
