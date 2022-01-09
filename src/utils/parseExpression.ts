import { JoinExpression, SQL } from "../types";

export const parseExpression = (
	expression: JoinExpression,
	innerTable: string,
	outerTable: string
): SQL => {
	return `${innerTable}.${expression.innerField} ${expression.operator} ${outerTable}.${expression.outerField}`;
};
