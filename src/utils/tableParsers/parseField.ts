import { parseCheck, parseFieldType } from ".";
import { FieldConfig, SQL, ValidSQLType } from "@/types";
import { parseSQLValues } from "..";

export const parseField = <TF extends ValidSQLType>([fieldName, fieldConfig]: [
	string,
	FieldConfig<TF>
]): SQL => {
	let validField: SQL = `${fieldName} `;

	validField += parseFieldType(fieldConfig);

	if (fieldConfig.isUnique) {
		validField += " UNIQUE";
	}

	if (fieldConfig.isAutoIncrement) {
		validField += " AUTO_INCREMENT";
	}

	if (fieldConfig.isNotNull) {
		validField += " NOT NULL";
	}
	if (fieldConfig.default) {
		const value =
			typeof fieldConfig.default === "string"
				? parseSQLValues([fieldConfig.default])
				: fieldConfig.default;
		validField += ` DEFAULT ${value}`;
	}
	if (fieldConfig.check) {
		validField += ` ${parseCheck(fieldName, fieldConfig.check)}`;
	}

	return validField;
};
