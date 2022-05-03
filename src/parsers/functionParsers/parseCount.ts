import { AnyObject, Count, SQL } from "@/types";
import { toString } from "@/utils";
import { parseIf } from "./parseIf";

export const parseCount = <TF extends AnyObject>(
	table: string,
	count: Count<TF>
): SQL => {
	let body: string | null = null;
	let name: string | null = null;

	if (typeof count.body !== "object") {
		body = toString([table, count.body], ".");
	} else {
		body = parseIf(table, count.body);
		name = count.name || null;
	}

	const sqlCount = `count(${body})`;
	return name ? toString([sqlCount, name], " as ") : sqlCount;
};
