import { addPrefix } from "./addPrefix";
import { isEmpty } from "./isEmpty";
import { receiveConfigs } from "./receiveConfigs";
import { AnyObject, ForeignKeys, Join, Reference } from "@/types";

export const getJoinedFields = <T extends AnyObject>(
	foreignKeys: ForeignKeys<T>,
	joinedTable?: Array<Join | string>,
	recurseJoin = false
): string[] => {
	let references = Object.values(foreignKeys);
	if (joinedTable && !isEmpty(joinedTable)) {
		const joinedName = joinedTable.map((join) =>
			typeof join === "string" ? join : join.table
		);
		references = references
			.filter<Reference>((ref): ref is Reference => ref !== undefined)
			.filter((ref) => joinedName.includes(ref.tableName));
	}

	const fields: string[] = [];

	references.forEach((reference) => {
		/* Нужно, чтобы ts не жаловался */
		if (!reference) {
			return;
		}
		const refConfig = receiveConfigs(reference.tableName);

		if (!refConfig) {
			return;
		}
		const refFields = Object.keys(refConfig.fields).filter(
			(fieldName) => fieldName !== reference.field
		);

		fields.push(...refFields.map((field) => addPrefix(field, refConfig.table)));

		if (refConfig.foreignKeys && recurseJoin) {
			fields.push(...getJoinedFields(refConfig.foreignKeys));
		}
	});

	return fields;
};
