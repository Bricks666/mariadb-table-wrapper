import { isEmpty, toJSON, toString } from "..";
import { FieldConfig, SQLTypes } from "../../types";

export const parseFieldType = (fieldConfig: FieldConfig): string => {
	switch (fieldConfig.type) {
		case SQLTypes.VARCHAR: {
			if (
				typeof fieldConfig.varcharLen === "undefined" ||
				fieldConfig.varcharLen <= 0
			) {
				throw new Error(
					"When field have type VARCHAR, varchar must not be undefined and less than 0"
				);
			}
			return `${SQLTypes.VARCHAR}(${fieldConfig.varcharLen})`;
		}
		case SQLTypes.SMALLINT: {
			let validField = `${SQLTypes.SMALLINT}`;
			if (fieldConfig.isUnsigned) {
				validField += " UNSIGNED";
			}
			return validField;
		}
		case SQLTypes.DATE: {
			return SQLTypes.DATE;
		}
		case SQLTypes.BOOLEAN: {
			return SQLTypes.BOOLEAN;
		}
		case SQLTypes.ENUM: {
			if (
				typeof fieldConfig.enumValues === "undefined" ||
				isEmpty(fieldConfig.enumValues)
			) {
				throw new Error("Enum values must be provided");
			}
			return `ENUM(${toString(toJSON(fieldConfig.enumValues), ",")})`;
		}
	}
};
