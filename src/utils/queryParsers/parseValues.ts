import { parseSQLValues, toString } from "..";
import { AnyObject, SQL } from "../..";

export const parseValues = <T extends AnyObject>(values: T[]): SQL => {
	const parsedValues: SQL[] = values.map(
		(value) => `(${parseSQLValues(value)})`
	);

	return `VALUES ${toString(parsedValues, ",")}`;
};
