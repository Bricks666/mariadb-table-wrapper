export const parseConstraint = (
	tableName: string,
	field: string,
	prefix = ""
) => {
	return `CONSTRAINT ${tableName}_${field}_${prefix}`;
};
