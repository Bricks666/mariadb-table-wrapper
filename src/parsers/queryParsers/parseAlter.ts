import { AlterTableRequest, AnyObject, ValidSQLType } from "@/types";
import { parseConstraint } from "@/utils/parseConstraint";
import { parseField } from "../tableParsers/parseField";
import { parseForeignKey } from "../tableParsers/parseForeignKey";
import { parsePrimaryKeys } from "../tableParsers/parsePrimaryKeys";

export const parseAlter = <
	T extends ValidSQLType = ValidSQLType,
	TF extends AnyObject = AnyObject
>(
		tableName: string,
		params: AlterTableRequest<T, TF>
	) => {
	let options = "";
	switch (params.type) {
		case "ADD COLUMN": {
			options = parseField([params.fieldName as string, params.field]);
			break;
		}
		case "ALTER COLUMN": {
			options = `${params.fieldName} SET DEFAULT ${params.default}`;
			break;
		}
		case "DROP COLUMN": {
			options = params.fieldName as string;
			break;
		}
		case "MODIFY COLUMN": {
			options = parseField([params.fieldName as string, params.field]);
			break;
		}
		case "ADD FOREIGN KEY": {
			options = parseForeignKey(tableName, [
				params.fieldName as string,
				params.reference,
			]);
			break;
		}
		case "DROP FOREIGN KEY": {
			options = `${parseConstraint(
				tableName,
				params.fieldName as string,
				"fk"
			)} DROP INDEX ${params.fieldName}`;
			break;
		}
		case "ADD PRIMARY KEY": {
			options = parsePrimaryKeys(
				tableName,
				params.fieldNames as unknown as string[]
			);
			break;
		}
	}

	return `${params.type} ${options}`;
};
