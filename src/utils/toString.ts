import { SQL } from "@/types";

export const toString = (
	array: (string | number | symbol)[],
	separator = ", "
): string | SQL => {
	return array.filter((item) => Boolean(String(item))).join(separator);
};
