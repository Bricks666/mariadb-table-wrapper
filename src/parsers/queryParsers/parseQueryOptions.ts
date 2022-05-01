import {
	isEmpty,
	undefinedToNull,
	toString,
	isArray,
	addPrefix,
	isObject,
	isExpressions,
} from "@/utils";
import {
	AnyObject,
	Expressions,
	MappedObject,
	OrderDirection,
	Query,
	SQL,
	TableFilters,
	ValidSQLType,
} from "@/types";
import { parseExpressions } from "../tableParsers";

const parseWhere = <T extends AnyObject>(
	tableName: string,
	filters: NonNullable<Query<T>["filters"]>
): SQL => {
	const SQLFilters: SQL[] = [];
	if (isObject(filters) && !isExpressions(Object.values(filters)[0])) {
		Object.entries(
			filters as MappedObject<TableFilters<T> | TableFilters<T>[]>
		).forEach(([tableName, filters]) => {
			SQLFilters.push(...parseFilters(tableName, filters));
		});
	} else {
		SQLFilters.push(
			...parseFilters(tableName, filters as TableFilters<T> | TableFilters<T>[])
		);
	}

	return `WHERE ${toString(SQLFilters, " OR ")}`;
};

const parseFilters = <T extends AnyObject>(
	tableName: string,
	filters: TableFilters<T> | TableFilters<T>[]
) => {
	if (isArray(filters)) {
		return filters.map((filter) => parseFilter(tableName, filter));
	} else {
		return [parseFilter(tableName, filters as TableFilters<T>)];
	}
};

const parseFilter = <T extends AnyObject>(
	tableName: string,
	filter: TableFilters<T>
) => {
	const keys = Object.keys(filter);

	const conditions: SQL[] = keys.map((key) =>
		parseExpressions(
			addPrefix(key, tableName),
			filter[key] as Expressions<ValidSQLType>
		)
	);
	return toString(conditions, " AND ");
};

const parseLimit = <TF extends AnyObject>({
	page,
	countOnPage,
}: NonNullable<Query<TF>["limit"]>): SQL => {
	const start = (page - 1) * countOnPage;
	return `LIMIT ${start},${countOnPage}`;
};

const parseOrdering = <T extends AnyObject>(
	orderBy: NonNullable<Query<T>["orderBy"]>
) => {
	const fieldAndDirection = Object.entries(orderBy);
	const orderingConditions: string[] = fieldAndDirection.map((pair) =>
		toString(pair as [string, OrderDirection], " ")
	);

	return `ORDER BY ${toString(orderingConditions, ",")}`;
};

const parseGroupBy = <TF extends AnyObject>(
	tableName: string,
	groupBy: NonNullable<Query<TF>["groupBy"]>
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

export const parseQueryOptions = <TF extends AnyObject>(
	tableName: string,
	{ filters, groupBy, orderBy, limit }: Partial<Query<TF>>
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
	return toString([where, group, order, page], " ");
};
