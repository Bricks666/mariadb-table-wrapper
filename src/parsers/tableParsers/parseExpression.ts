import { isArray, toString } from "@/utils";
import { Expression, Operators, SQL, ValidSQLType } from "@/types";
import { ParamsError } from "@/lib";
import { parseSQLValues } from "../queryParsers";

/**
 * TODO: Упростить функцию
 */
export const parseExpression = <T extends ValidSQLType>(
	field: string,
	{ operator, value, not }: Expression<T>
): SQL => {
	const SQLOperator = operator.toUpperCase();
	const conditionParts: SQL[] = [];
	if (not) {
		conditionParts.push("NOT");
	}


	/* Нужны наглядные приведения, потому что TS, он не считывает адекватно тип после abort, даже при гуарде */
	abortInvalidParsing(operator, value);
	conditionParts.push(field);
	switch (operator) {
		case "between": {
			value = value as T[];
			conditionParts.push(SQLOperator, toString(value, " AND "));
			break;
		}
		case "in": {
			value = value as T[];
			conditionParts.push(SQLOperator, `(${parseSQLValues(value)})`);
			break;
		}
		case "regExp":
		case "like": {
			conditionParts.push(SQLOperator, parseSQLValues([value]));
			break;
		}
		case "is null": {
			conditionParts.push(field, "IS NULL");
			break;
		}
		default: {
			value = value as T;
			const SQlValue =
				typeof value === "string"
					? parseSQLValues([value])
					: (value as unknown as string);
			conditionParts.push(SQLOperator, SQlValue);
			break;
		}
	}
	return toString(conditionParts, " ");
};

interface Validating {
	readonly validator: (
		value: ValidSQLType | ValidSQLType[] | undefined
	) => boolean;
	readonly error: ParamsError | null;
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
	logic: {
		error: new ParamsError(
			"createTable",
			"parseExpression",
			"When use logic operator, value must be simple"
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
	"is null": {
		error: null,
		validator: () => true,
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
		validating = validatingMap["logic"] as Validating;
	}

	if (!validating.validator(value)) {
		throw validating.error;
	}

	return true;
};
