import { SQL } from "@/types";

export const toString = (
	array: (string | number | symbol | null)[],
	separator = ", "
): string | SQL => {
	return array
		.filter((item) => item !== undefined && item !== "")
		.map(String)
		.join(separator);
};
