import { parseSelect } from "./parseSelect";
import { receiveConfigs } from "@/utils";
import { AnyObject, SelectQuery, SQL } from "@/types";
export const parseSubSelect = <TF extends AnyObject>(
	table: string,
	query: SelectQuery<TF>
): SQL => {
	const config = receiveConfigs<TF>(table);
	if (!config) {
		throw new Error();
	}

	const { fields, foreignKeys } = config;

	return (
		"(" + parseSelect({ table, query, foreignKeys, tableFields: fields }) + ")"
	);
};
