import { isArray, parseSQLValues, toString } from "..";
import { AnyObject, SQL } from "../..";

export const parseValues = <T extends AnyObject>(values: T | T[]): SQL => {
	const SQLValues: T[] = isArray(values) ? values : [values];

	const parsedValues: SQL[] = SQLValues.map(
		(value) => `(${parseSQLValues(value)})`
	);

	return `VALUES ${toString(parsedValues, ",")}`;
};
