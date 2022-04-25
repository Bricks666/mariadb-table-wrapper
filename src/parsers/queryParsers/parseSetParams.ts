import { toJSON, toString } from "../../utils";
import { SQL } from "../../types";

export const parseSetParams = (params: object): SQL => {
	const keys: string[] = Object.keys(params);
	const values: string[] = toJSON(Object.values(params));
	const pairs: SQL[] = keys.map((key, i) => `${key} = ${values[i]}`);

	return toString(pairs);
};
