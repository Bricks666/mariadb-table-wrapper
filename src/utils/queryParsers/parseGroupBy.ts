import { addPrefix, isArray, toString } from "..";
import { GroupBy, AnyObject } from "../../types";

export const parseGroupBy = <TF extends AnyObject>(
	groupBy: GroupBy<TF>,
	tableName: string
): string => {
	const grouping: string[] = [];

	if (isArray(groupBy)) {
		grouping.push(
			...groupBy.map((field) => addPrefix(field as string, tableName))
		);
	} else {
		const tableAndGroup = Object.entries(groupBy);
		tableAndGroup.forEach(([tableName, group]) => {
			grouping.push(...group.map((field) => addPrefix(field, tableName)));
		});
	}

	return `GROUP BY ${toString(grouping)}`;
};
