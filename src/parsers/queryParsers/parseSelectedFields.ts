import {
	ExcludeFields,
	AnyObject,
	IncludeFields,
	SQL,
	AssociateField,
	MappedObject,
	SelectQuery,
} from "@/types";
import { fullField, isArray, isEmpty, isObject, toString } from "@/utils";
import { parseFunctions } from "../functionParsers";

const parseAs = <T extends AnyObject>(associate: AssociateField<T>): SQL => {
	return toString(associate, " as ");
};

const parseIncludes = <T extends AnyObject>(
	tableName: string,
	includes: NonNullable<SelectQuery<T>["includes"]>
): SQL => {
	let include = null;
	if (isArray(includes)) {
		include = toString(
			includes.map((el) => {
				return isArray(el)
					? fullField(tableName, parseAs(el))
					: isObject(el)
						? parseFunctions(tableName, el)
						: fullField(tableName, el.toString());
			})
		);
	} else {
		const pairs = Object.entries(includes);
		include = toString(
			pairs.map<SQL>((pair) => parseIncludes(pair[0], pair[1]))
		);
	}

	return include;
};

const parseExclude = (excludes: string[], table: string): string[] => {
	return excludes.map((exclude) => fullField(table, exclude));
};

const parseExcludes = <T extends AnyObject>(
	tableName: string,
	fields: string[],
	excludes: NonNullable<SelectQuery<T>["excludes"]>
): SQL => {
	let excludesFields: string[] = [];

	if (isArray<string[]>(excludes)) {
		excludesFields = parseExclude(excludes, tableName);
	} else {
		const tableAndFields = Object.entries(excludes);
		tableAndFields.forEach(([table, fields]) =>
			excludesFields.push(...parseExclude(fields, table))
		);
	}

	return toString(
		Object.values(fields).filter((filed) => !excludesFields.includes(filed))
	);
};

interface SelectedFieldsParams<TF extends AnyObject> {
	tableName: string;
	fields: string[];
	excludes?: ExcludeFields<TF> | MappedObject<ExcludeFields<AnyObject>>;
	includes?: IncludeFields<TF> | MappedObject<IncludeFields<AnyObject>>;
}

export const parseSelectedFields = <TF extends AnyObject>({
	tableName,
	fields,
	excludes,
	includes,
}: SelectedFieldsParams<TF>): SQL => {
	const select: SQL[] = [];

	if (excludes && !isEmpty(excludes)) {
		select.push(parseExcludes(tableName, fields, excludes));
	}

	if (includes && !isEmpty(includes)) {
		select.push(parseIncludes(tableName, includes));
	}

	return toString(select) || "*";
};
