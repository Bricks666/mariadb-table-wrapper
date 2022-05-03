export type MappedObject<T> = {
	[key: string]: T;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = MappedObject<any>;

export type SQL = string;
export type ValidSQLType = string | number;
