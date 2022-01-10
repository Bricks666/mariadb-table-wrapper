import { addPrefix, receiveConfigs } from ".";
import { AnyObject, ForeignKeys } from "..";

/*
 * Return all fields referenced by the table records
 */
export const getJoinedFields = <T extends AnyObject>(
	foreignKeys: ForeignKeys<T>
): string[] => {
	const references = Object.values(foreignKeys);

	const fields: string[] = [];

	references.forEach((reference) => {
		/* Нужно, чтобы ts не жаловался */
		if (reference) {
			const refConfig = receiveConfigs(reference.tableName);

			if (refConfig) {
				const refFields = Object.keys(refConfig.fields).filter(
					(fieldName) => fieldName !== reference.field
				);

				fields.push(...addPrefix(refFields, refConfig.table, "."));

				if (refConfig.foreignKeys) {
					fields.push(...getJoinedFields(refConfig.foreignKeys));
				}
			}
		}
	});

	return fields;
};
