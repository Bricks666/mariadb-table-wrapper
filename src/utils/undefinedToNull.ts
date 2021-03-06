import { AnyObject } from "@/types";

export const undefinedToNull = <T extends AnyObject>(object: AnyObject): T => {
	for (const key of Object.keys(object)) {
		if (object[key] === undefined) {
			object[key] = null;
		}
	}

	return object as T;
};
