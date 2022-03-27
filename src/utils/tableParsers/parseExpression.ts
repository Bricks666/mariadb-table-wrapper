import { isArray } from "@/utils";
import { Expression, Operators, SQL, ValidSQLType } from "@/types";
import { ParamsError } from "@/lib";
import { parseSQLValues } from "../queryParsers";

export const parseExpression = <T extends ValidSQLType>(
	field: string,
	{ operator, value, not, template }: Expression<T>
): SQL => {
	const SQLOperator = operator.toUpperCase();
	let condition = `${field} `;
	const SQLnot = not ? "NOT" : "";
	debugger;
	/* Нужны наглядные приведения, потому что TS, он не считывает адекватно тип после abort, даже при гуарде */
	switch (operator) {
		case "between": {
			abortInvalidParsing(operator, value);

			value = value as T[];
			condition += ` ${SQLnot} ${SQLOperator} ${value[0]} AND ${value[1]}`;
			break;
		}
		case "in": {
			abortInvalidParsing(operator, value);

			value = value as T[];
			condition += ` ${SQLnot} ${SQLOperator} (${parseSQLValues(value)})`;
			break;
		}
		case "regExp":
		case "like": {
			abortInvalidParsing(operator, template);
			condition += ` ${SQLnot} ${SQLOperator} ${parseSQLValues([template])}`;
			break;
		}
		case "is null": {
			condition += `IS ${SQLnot} NULL`;
			break;
		}
		default: {
			abortInvalidParsing(operator, value);

			value = value as T;
			const SQlValue =
				typeof value === "string" ? parseSQLValues([value]) : value;
			condition += ` ${SQLOperator} ${SQlValue}`;
			break;
		}
	}
	return condition;
};

interface Validating {
	readonly validator: (
		value: ValidSQLType | ValidSQLType[] | undefined
	) => boolean;
	readonly error: ParamsError;
}

const likeValidating: Validating = {
	error: new ParamsError(
		"createTable",
		"parseExpression",
		"When use 'like' operator or 'regExp' operator, value must be provided and be string"
	),
	validator: (value) => typeof value === "string" && !isArray(value),
};

const validatingMap: Partial<Record<string, Validating>> = {
	between: {
		error: new ParamsError(
			"createTable",
			"parseExpression",
			"When use 'between' operator, value must be a tuple with length === 2"
		),
		validator: (value) => isArray(value) && value.length === 2,
	},
	arithmetic: {
		error: new ParamsError(
			"createTable",
			"parseExpression",
			"When use arithmetic operator, value must be simple"
		),
		validator: (value) => !isArray(value) && typeof value !== "undefined",
	},
	in: {
		error: new ParamsError(
			"createTable",
			"parseExpression",
			"When use 'in' operator, value must be an array"
		),
		validator: (value) => isArray(value),
	},
	regExp: likeValidating,
	like: likeValidating,
};

const abortInvalidParsing = (
	operator: Operators,
	value: ValidSQLType | ValidSQLType[] | undefined
) => {
	let validating = validatingMap[operator];
	if (!validating) {
		validating = validatingMap["arithmetic"] as Validating;
	}

	if (!validating.validator(value)) {
		throw validating.error;
	}

	return true;
};
