import { toString } from "..";
import { AnyObject, Ordering } from "../..";

export const parseOrdering = <T extends AnyObject>(ordering: Ordering<T>) => {
	const fieldAndDirection = Object.entries(ordering);
	const orderingConditions: string[] = fieldAndDirection.map(
		([field, direction]) => `${field} ${direction}`
	);

	return `ORDER BY ${toString(orderingConditions, ",")}`;
};
