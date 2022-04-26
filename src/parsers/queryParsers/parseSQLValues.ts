import { toJSON, toString } from "@/utils";
import { AnyObject } from "@/types";

export const parseSQLValues = <T extends AnyObject>(object: T): string => {
	return toString(toJSON(Object.values(object)));
};
