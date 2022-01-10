import { toString } from "..";
import { FieldConfig, Fields, MappedObject, SQL } from "../../types";

export const parsePrimaryKeys = <TF extends MappedObject<string>>(
	fields: Fields<TF>
): SQL => {
	const primaryKeyNames: SQL[] = Object.entries<FieldConfig>(fields)
		.filter(([, config]) => config.isPrimaryKey)
		.map(([name]) => name);
	const keys = toString(primaryKeyNames);
	return keys && `PRIMARY KEY(${keys})`;
};
