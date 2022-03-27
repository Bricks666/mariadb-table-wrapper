import { isEmpty, undefinedToNull, toString, isArray, addPrefix } from "..";
import {
	AnyObject,
	GroupBy,
	Limit,
	OrderBy,
	OrderDirection,
	SQL,
	TableFilters,
} from "@/types";
import { parseWhere } from "./parseWhere";

const parseLimit = ({ page, countOnPage }: Limit): SQL => {
	const start = (page - 1) * countOnPage;
	return `LIMIT ${start},${countOnPage}`;
};

const parseOrdering = <T extends AnyObject>(orderBy: OrderBy<T>) => {
	const fieldAndDirection = Object.entries(orderBy);
	const orderingConditions: string[] = fieldAndDirection.map((pair) =>
		toString(pair as [string, OrderDirection], " ")
	);

	return `ORDER BY ${toString(orderingConditions, ",")}`;
};

const parseGroupBy = <TF extends AnyObject>(
	tableName: string,
	groupBy: GroupBy<TF>
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

export const parseSelectOptions = <TF extends AnyObject>(
	tableName: string,
	filters?: TableFilters<TF> | TableFilters<TF>[],
	groupBy?: GroupBy<TF>,
	orderBy?: OrderBy<TF>,
	limit?: Limit
): SQL => {
	let where: SQL = "";
	let group: SQL = "";
	let order: SQL = "";
	let page: SQL = "";

	if (filters && !isEmpty(filters)) {
		where = parseWhere(tableName, filters);
	}

	if (groupBy && !isEmpty(groupBy)) {
		group = parseGroupBy(tableName, groupBy);
	}

	if (orderBy && !isEmpty(orderBy)) {
		const orderingWithNull = undefinedToNull<typeof orderBy>(orderBy);
		order = parseOrdering(orderingWithNull);
	}
	if (limit && !isEmpty(limit)) {
		page = parseLimit(limit);
	}
	return `${where} ${group} ${order} ${page}`;
};
