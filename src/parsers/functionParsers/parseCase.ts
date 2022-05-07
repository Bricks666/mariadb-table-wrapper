import { SQL, Case, CaseExpression } from "@/types";
import { fullField, toJSON, toString } from "@/utils";
import { parseExpressions } from "../tableParsers";
const parseCaseOption = (caseOption: CaseExpression): SQL => {
	const field = fullField(caseOption.table, caseOption.field);
	const expression = parseExpressions(field, caseOption.expression);
	const value = toString([toJSON(caseOption.value)]);
	return `WHEN ${expression} THEN ${value}`;
};
export const parseCase = (caseFunc: Case): SQL => {
	const type = caseFunc.type.toUpperCase();
	const options = caseFunc.cases.map(parseCaseOption);
	const defaultValue =
		caseFunc.defaultValue != undefined
			? `DEFAULT ${toString([toJSON(caseFunc.defaultValue)])}`
			: "";
	const end = "END";
	const name = caseFunc.name;
	const sql = toString([type, toString(options, " "), defaultValue, end], " ");
	return name ? toString([sql, name], " as ") : sql;
};
