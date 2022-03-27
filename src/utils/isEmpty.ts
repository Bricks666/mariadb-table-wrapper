import { isArray } from "./isArray";
import { isObject } from "./isObject";

export const isEmpty = (value: unknown): boolean => {
	if (typeof value === "undefined") {
		return true;
	}

	if (isArray(value)) {
		return value.length === 0;
	}
	if (isObject(value)) {
		return Object.getOwnPropertyNames(value).length === 0;
	}
	return !value;
};
