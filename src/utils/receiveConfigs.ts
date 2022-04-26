import { AnyObject, TableConfig } from "@/types";
import { CONFIGS_OBJECT } from "../config";

export const receiveConfigs = (tableName: string): TableConfig<AnyObject> => {
	const config = CONFIGS_OBJECT[tableName];

	if (!config) {
		throw new Error();
	}

	return config;
};
