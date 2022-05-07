import { ValidSQLType } from "@/types";

export const toJSON = (value: ValidSQLType): string => {
	return String(value) ? JSON.stringify(value) : "";
};
