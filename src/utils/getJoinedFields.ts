import { addPrefix, isEmpty, receiveConfigs } from ".";
import { AnyObject, ForeignKeys, Reference } from "..";

/*
 * Return all fields referenced by the table records
 */
export const getJoinedFields = <T extends AnyObject>(
	foreignKeys: ForeignKeys<T>,
	joinedTable?: string[],
	recurseJoin = false
): string[] => {
	let references = Object.values(foreignKeys);
	if (joinedTable && !isEmpty(joinedTable)) {
		references = references
			.filter<Reference>((ref): ref is Reference => ref !== undefined)
			.filter((ref) => joinedTable.includes(ref.tableName));
	}

	const fields: string[] = [];

	references.forEach((reference) => {
		/* Нужно, чтобы ts не жаловался */
		if (reference) {
			const refConfig = receiveConfigs(reference.tableName);

			if (refConfig) {
				const refFields = Object.keys(refConfig.fields).filter(
					(fieldName) => fieldName !== reference.field
				);

				fields.push(
					...refFields.map((field) => addPrefix(field, refConfig.table))
				);

				if (refConfig.foreignKeys && recurseJoin) {
					fields.push(...getJoinedFields(refConfig.foreignKeys));
				}
			}
		}
	});

	return fields;
};
