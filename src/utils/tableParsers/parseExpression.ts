import { AnyObject, Expression, SQL } from "../../types";

export const parseExpression = <T extends AnyObject>({
	field,
	operator,
	value,
}: Expression<T>): SQL => {
	return `${field}${operator}${value}`;
};
