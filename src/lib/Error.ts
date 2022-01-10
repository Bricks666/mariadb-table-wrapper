import { toString } from "..";

export type QueryType = "select" | "insert" | "delete" | "update" | "truncate";

export class ParamsError extends Error {
	public readonly name = "Query params error";
	public readonly query: QueryType;
	public readonly params: string[];
	public readonly error: string;

	constructor(query: QueryType, params: string[], error: string) {
		super(ParamsError.CreateErrorMessage(query, params, error));
		this.query = query;
		this.params = params;
		this.error = error;
	}

	private static CreateErrorMessage(
		query: QueryType,
		params: string[],
		error: string
	): string {
		return `In query ${query} occurred an error. Param(s) ${toString(
			params
		)} ${error}`;
	}
}
