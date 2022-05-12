import { AnyObject, TableConfig } from "@/types";
import { CONFIGS_OBJECT } from "@/config";

export const receiveConfigs = <TF extends AnyObject = AnyObject>(
	tableName: string
): TableConfig<TF> | undefined => {
	return CONFIGS_OBJECT[tableName] as TableConfig<TF>;
};
