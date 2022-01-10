import { AnyObject } from "..";

export const getVarName = (obj: AnyObject): string => {
	return Object.keys(obj)[0];
};
