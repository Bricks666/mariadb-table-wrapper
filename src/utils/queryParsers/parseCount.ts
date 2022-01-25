import { toString } from "..";
import { Count } from "./../../types/";
export const parseCount = <TF>(counts: Count<TF>) => {
	const parsedCounts = counts.map(
		(count) => `count(${count[0]}) as ${count[1]}`
	);

	return toString(parsedCounts);
};
