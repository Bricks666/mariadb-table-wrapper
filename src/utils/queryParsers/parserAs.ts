import { AnyObject, AssociateField, SQL } from "../../types";

export const parseAs = <T extends AnyObject>(
	associate: AssociateField<T>
): SQL => {
	return `${associate[0]} AS ${associate[1]}`;
};
