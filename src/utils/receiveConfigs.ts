import { AnyObject, TableConfig } from "..";
import { CONFIGS_OBJECT } from "../config";

export const receiveConfigs = (
	tableName: string
): TableConfig<AnyObject> | undefined => {
	return CONFIGS_OBJECT[tableName];
};
