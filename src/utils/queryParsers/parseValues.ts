import { parseSQLValues } from "../queryParsers";
import { toString } from "../toString";
import { AnyObject, SQL } from "@/types";

export const parseValues = <T extends AnyObject>(values: T[]): SQL => {
	const parsedValues: SQL[] = values.map(
		(value) => `(${parseSQLValues(value)})`
	);

	return `VALUES ${toString(parsedValues, ",")}`;
};
