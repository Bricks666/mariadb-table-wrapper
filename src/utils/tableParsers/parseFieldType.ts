import { isEmpty, toJSON, toString } from "..";
import { FieldConfig, SQLTypes } from "../../types";

const stringTypes = [SQLTypes.VARCHAR, SQLTypes.CHAR];
const unsignedTypes = [
	SQLTypes.TINYINT,
	SQLTypes.SMALLINT,
	SQLTypes.INT,
	SQLTypes.MEDIUMINT,
	SQLTypes.BIGINT,
];
const complexTypes = [SQLTypes.ENUM, SQLTypes.SET];

export const parseFieldType = ({
	type,
	...fieldConfig
}: FieldConfig): string => {
	let SQLType: string = type;

	if (stringTypes.includes(type)) {
		if (
			typeof fieldConfig.stringLen === "undefined" ||
			fieldConfig.stringLen <= 0
		) {
			throw new Error(
				"When field have type VARCHAR or CHAR, string length must not be undefined and less than 0"
			);
		}
		SQLType += `(${fieldConfig.stringLen})`;
	}

	if (unsignedTypes.includes(type) && fieldConfig.isUnsigned) {
		SQLType += " UNSIGNED";
	}

	if (complexTypes.includes(type)) {
		if (
			typeof fieldConfig.enumSetValues === "undefined" ||
			isEmpty(fieldConfig.enumSetValues)
		) {
			throw new Error("Enum/Set values must be provided");
		}
		SQLType += `(${toString(toJSON(fieldConfig.enumSetValues), ",")})`;
	}

	return SQLType;
};
