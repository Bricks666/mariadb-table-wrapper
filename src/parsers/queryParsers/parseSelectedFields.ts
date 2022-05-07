import {
	ExcludeFields,
	AnyObject,
	IncludeFields,
	SQL,
	AssociateField,
	MappedObject,
	SelectQuery,
	Functions,
} from "@/types";
import { fullField, isArray, isEmpty, toString } from "@/utils";
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
				const field = isArray(el) ? parseAs(el) : el.toString();
				return fullField(tableName, field);
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

const parseFunction = <TF extends AnyObject>(
	table: string,
	functions: NonNullable<SelectedFieldsParams<TF>["functions"]>
): SQL => {
	let parsedFunctions = [];
	if (isArray(functions)) {
		parsedFunctions = functions.map((func) => parseFunctions(table, func));
	} else {
		parsedFunctions = Object.entries(functions).map(([table, functions]) =>
			parseFunction(table, functions)
		);
	}
	return toString(parsedFunctions);
};

interface SelectedFieldsParams<TF extends AnyObject> {
	tableName: string;
	fields: string[];
	excludes?: ExcludeFields<TF> | MappedObject<ExcludeFields<AnyObject>>;
	includes?: IncludeFields<TF> | MappedObject<IncludeFields<AnyObject>>;
	functions?: Array<Functions<TF>> | MappedObject<Array<Functions<TF>>>;
}

export const parseSelectedFields = <TF extends AnyObject>({
	tableName,
	fields,
	excludes,
	includes,
	functions,
}: SelectedFieldsParams<TF>): SQL => {
	const select: SQL[] = [];

	if (excludes && !isEmpty(excludes)) {
		select.push(parseExcludes(tableName, fields, excludes));
	}

	if (includes && !isEmpty(includes)) {
		select.push(parseIncludes(tableName, includes));
	}
	/** TODO: Обновить функцию парсинга, заменить count на любую функцию */
	if (functions && !isEmpty(functions)) {
		select.push(parseFunction(tableName, functions));
	}

	return toString(select) || "*";
};
