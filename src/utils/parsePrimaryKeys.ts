import { toString } from ".";
import { FieldConfig, Fields, MappedObject, SQL } from "../types";

export const parsePrimaryKeys = <TF extends MappedObject<string>>(
	fields: Fields<TF>
): SQL => {
	const primaryKeyNames: SQL[] = Object.entries<FieldConfig>(fields)
		.filter(([_, config]) => config.isPrimaryKey)
		.map(([name]) => name);

	return `PRIMARY KEY(${toString(primaryKeyNames)})`;
};
