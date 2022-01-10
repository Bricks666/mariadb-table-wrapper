import { TableConfig } from "..";
import { CONFIGS_OBJECT } from "../config";

export const accumulateConfigs = <T>(config: TableConfig<T>) => {
	CONFIGS_OBJECT[config.table] = config;
};
