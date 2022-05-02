import {
	ExcludeFields,
	AnyObject,
	IncludeFields,
	Count,
	SQL,
	AssociateField,
	MappedObject,
	SelectQuery,
} from "@/types";
import { addPrefix, isArray, isEmpty, isObject, toString } from "@/utils";
import { parseExpressions } from "../tableParsers";

const parseAs = <T extends AnyObject>(associate: AssociateField<T>): SQL => {
	return toString(associate, " as ");
};

const parseIncludes = <T extends AnyObject>(
	tableName: string,
	includes: NonNullable<SelectQuery<T>["includes"]>
): SQL[] => {
	if (isArray(includes)) {
		return includes.map((el) => {
			const field = isArray(el) ? parseAs(el) : el.toString();
			return addPrefix(field, tableName);
		});
	} else {
		const pairs = Object.entries(includes);
		return pairs.map<SQL>((pair) => toString(parseIncludes(pair[0], pair[1])));
	}
};

const parseExclude = (excludes: string[], table: string): string[] => {
	return excludes.map((exclude) => addPrefix(exclude, table));
};

const parseExcludes = <T extends AnyObject>(
	tableName: string,
	fields: string[],
	excludes: NonNullable<SelectQuery<T>["excludes"]>
): SQL[] => {
	let excludesFields: string[] = [];

	if (isArray<string[]>(excludes)) {
		excludesFields = parseExclude(excludes, tableName);
	} else {
		const tableAndFields = Object.entries(excludes);
		tableAndFields.forEach(([table, fields]) =>
			excludesFields.push(...parseExclude(fields, table))
		);
	}

	return Object.values(fields).filter(
		(filed) => !excludesFields.includes(filed)
	);
};

const parseCount = <T extends AnyObject>(
	count: NonNullable<SelectQuery<T>["count"]>,
	tableName: string
) => {
	const parsedCount: SQL[] = [];

	if (isArray(count)) {
		parsedCount.push(
			...count.map((count) => {
				let field = null;
				let name = null;
				if (isArray(count)) {
					field = addPrefix(count[0] as string, tableName);
					name = count[1];
				} else if (isObject(count)) {
					field = parseExpressions(count.field as string, count.expressions);
					name = count.name || null;
				} else {
					field = addPrefix(count as string, tableName);
				}
				const sql = `count(${field.toString()})`;
				return name ? parseAs([sql, name]) : sql;
			})
		);
	} else {
		const countPairs = Object.entries(count);
		countPairs.forEach(([tableName, count]) =>
			parsedCount.push(...parseCount(count, tableName))
		);
	}

	return parsedCount;
};
interface SelectedFieldsParams<TF extends AnyObject> {
	tableName: string;
	fields: string[];
	excludes?: ExcludeFields<TF> | MappedObject<ExcludeFields<AnyObject>>;
	includes?: IncludeFields<TF> | MappedObject<IncludeFields<AnyObject>>;
	count?: Count<TF> | MappedObject<Count<AnyObject>>;
}

export const parseSelectedFields = <TF extends AnyObject>({
	tableName,
	fields,
	excludes,
	includes,
	count,
}: SelectedFieldsParams<TF>) => {
	const select: SQL[] = [];

	if (excludes && !isEmpty(excludes)) {
		select.push(...parseExcludes(tableName, fields, excludes));
	}

	if (includes && !isEmpty(includes)) {
		select.push(...parseIncludes(tableName, includes));
	}

	if (count && !isEmpty(count)) {
		select.push(...parseCount(count, tableName));
	}

	return toString(select) || "*";
};
