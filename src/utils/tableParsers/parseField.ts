import { parseFieldType } from ".";
import { FieldConfig, SQL } from "../../types";

export const parseField = ([fieldName, fieldConfig]: [
	string,
	FieldConfig
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

	return validField;
};
