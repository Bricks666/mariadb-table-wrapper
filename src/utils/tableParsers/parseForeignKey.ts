import { Reference, SQL } from "../../types";

export const parseForeignKey = ([fieldName, reference]: [
	string,
	Reference
]): SQL => {
	const validKey: SQL = `FOREIGN KEY (${fieldName}) REFERENCES ${reference.tableName} (${reference.field}) ON DELETE CASCADE ON UPDATE CASCADE`;
	return validKey;
};
