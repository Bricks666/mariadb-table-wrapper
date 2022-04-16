# Documentation

## Chapters

- [Connection](#connection)
- [Table](#table)
  - [_Constructor_](#constructor)
  - [_Initialization_](#initialization)
  - [_Insert data to table_](#insert)
  - [_Select data from table_](#select-and-selectone)
  - [_Delete data from table_](#delete)
  - [_Update data in table_](#update)
  - [_Drop, truncate_](#drop)
  - [_Description of table_](#description-of-table)
  - [_Alter_](#alter)
- [Types](#types)
  - [_TableConfig_](#tableconfig)
  - [_Fields_](#fields)
  - [_FieldConfig_](#fieldconfig)
  - [_SQLTypes_](#sqltypes)
  - [_Expressions_](#expressions)
  - [_Expression_](#expression)
  - [_Operators_](#operators)
  - [_ValidSQLTypes_](#validsqltypes)
  - [_ForeignKeys_](#foreignkeys)
  - [_Reference_](#reference)
  - [_ChangeType_](#changetype)
  - [_Query_](#query)
  - [_TableFilters_](#tablefilters)
  - [_Limit_](#limit)
  - [_GroupBy_](#groupby)
  - [_OrderBy_](#orderby)
  - [_OrderingDirection_](#orderingdirection)
  - [_SelectQuery_](#selectquery)
  - [_JoinTable_](#jointable)
  - [_Join_](#join)
  - [_ExcludeFields_](#excludefields)
  - [_IncludeFields_](#includefields)
  - [_AssociateField_](#associatefield)
  - [_Count_](#count)
  - [_MappedObject_](#mappedobject)
  - [_AlterTableRequest_](#altertablerequest)
  - [_AddColumn_](#addcolumn)
  - [_DropColumn_](#dropcolumn)
  - [_ModifyColumn_](#modifycolumn)
  - [_AlterColumn_](#altercolumn)
  - [_AddForeignKey_](#addforeignkey)
  - [_DropForeignKey_](#dropforeignkey)
  - [_AddPrimaryKey_](#addprimarykey)
  - [_dropprimarykey_](#dropprimarykey)
  - [_AlterFieldConfig_](#alterfieldconfig)
  - [_Description_](#description)
- [Errors](#errors)

### Connection

For connection to the database library provides several mariadb function: [createConnection](https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md#createconnectionoptions--promise), [createPool](https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md#createpooloptions--pool) and [createPoolCluster](https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md#createpoolclusteroptions--poolcluster). With which you can get a connection.

### Table

#### Constructor

Table constructor waits config of table as a require parameter

```js
import { Table } from "mariadb-table-wrapper";

const anyTable = new Table({
	table: "tableName",

	fields: {
		someField: {
			type: "BOOL",
			isPrimaryKey: true,
		},
	},
	safeCreation: true,
	foreignKeys: {
		someField: {
			tableName: "another table",
			field: "field from another table",
		},
	},
});
```

Also in TypeScript you must to provide a type to the table. Every fields in provides types must be describe in the config

```ts
import { Table } from "mariadb-table-wrapper";

interface TableInterface {
	anyId: number;
	name: string;
}
const anyTable = new Table<TableInterface>({
	table: "tableName",

	fields: {
		anyId: {
			type: "SMALLINT",
			isPrimaryKey: true,
		},
		name: {
			type: "VARCHAR",
			stringLen: 64,
		},
	},
});
```

**Parameters:**

1. [**Require**] config[[_TableConfig_](#tableconfig)] - config of the table

#### Initialization

Before you can use table you must init it. For it you must provide [connection](https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md#connection-api) to the table method _init_

```js
import { createConnection } from "mariadb-table-wrapper";

//In any async function
const connection = await createConnection({
	/* Connection options */
});
await anyTable.init(connection);
```

In init method table to create a table on DB.

#### Insert

For the insert data to the table Table has an _insert_ method. Method returns Promise which resolves to void

```js
await anyTable.insert({
	/* Your insert data */
});
// or
await anyTable.insert([/* Your insert several same values */ {}, {}]);
```

In TS, you can narrow down the type of accepted values

```ts
interface AnyInsertInterface {
	/* Describe inserted objects */
}

await anyTable.insert<AnyInsertInterface>({
	/* Your insert data */
});
// or
await anyTable.insert<AnyInsertInterface>([
	{
		/* Your insert data */
	},
	{
		/* Your insert data */
	},
]);
```

**Parameters:**

1. [**Require**] values[_T_ | _T[]_] - objects which will be insert to the table

#### Select and selectOne

For select data from the table it has a select method. This method returns Promise which resolves to the array of selected data. In TS returns an array of object with the interface of this table by default, but you can to pass another interface.

```js
await anyTab.select({
	/* Select config */
});
```

```ts
/*  */
interface AnyAnotherResponse {
	/* Describe response */
}
await anyTable.select<AnyAnotherResponse>({
	/* Select config */
});
```

For select only one row from the table instance of Table class has selectOne method. This method returns Promise which resolves to the selected data or undefined.

```js
await anyTab.selectOne({
	/* Select config */
});
```

```ts
/*  */
interface AnyAnotherResponse {
	/* Describe response */
}
await anyTable.selectOne<AnyAnotherResponse>({
	/* Select config */
});
```

**Parameters:**

1. [**Optional**] config[[_SelectConfig_](#selectquery)] - options for select data from table

#### Delete

For delete any row from the table Table instance has a delete method. This method returns a Promise which resolves to void.

```js
await anyTab.delete({
	/* Delete config */
});
```

**Parameters:**

1. [**Optional**] config[[_Query_](#query)] - it's config that selects data which will be deleted

#### Update

For update data in the table Table instance has an update method. This method returns Promise which resolves to void

```js
await anyTable.update(
	{
		/* New values for table data */
	},
	{
		/* Config */
	}
);
```

In TS you must pass an interface of newValues

```ts
interface AnyNewValues {
	/* describe new values */
}

await anyTable.update<AnyNewValues>(
	{
		/* New values for table data */
	},
	{
		/* Config */
	}
);
```

**Parameters:**

1. [**Require**] newValues[_AnyObject | AnyNewValues_] - values which will be written
2. [**Optional**] config[[_Query_](#query)] - it's config that selects target rows

#### Drop

For delete all data from table Table instance provide two method - truncate asn drop
Truncate truncates for this table, drop drops for this table

```js
await anyTable.truncate();
await anyTable.drop();
```

**Parameters:**
Don't have parameters

#### Description of table

For get description of table Table instance provide _describe_ method

```js
await anyTable.describe();
```

**Parameters:**
Don't have parameters

#### Alter

For change table structure Table instance provide alter method

```js
await anyTable.alter({
	/* Alter config */
});
```

**Parameters:**

1. [**Require**] params[_[AlterTableRequest](#altertablerequest)|AlterTableRequest[]_] - params for change table structure

### Types

#### TableConfig

It's a generic interface. It takes type of the table.

**Fields:**

1. [**Require**] table[string] - name of this table in DB
2. [**Require**] fields[[_Fields_](#fields)] - object which contains describe of all table fields
3. [**Optional**] safeCreation[boolean] - if it's true in [init](#initialization) method will be added IF NOT EXISTS else won't
4. [**Optional**] foreignKeys[[_ForeignKeys_](#foreignkeys)] - object which contains describe all table foreign keys

```ts
interface TableConfig<TF extends AnyObject> {
	readonly table: string;
	readonly fields: Fields<TF>;
	readonly safeCreating?: boolean;
	readonly foreignKeys?: ForeignKeys<TF>;
}
```

#### Fields

It's a generic interface which describes fields in table config.

**Fields:**

1. [**Require**] _tableFieldName_[[_FieldConfig_](#fieldconfig)] - config of the table field

```ts
type Fields<TF> = {
	readonly [key in keyof TF]: FieldConfig<TF[key]>;
};
```

#### FieldConfig

It's a generic interface which contains describe of the table field

**Fields:**

1. [**Require**] type[[_SQLTypes_](#sqltypes)] - one of supported SQL types
2. [**Optional**] isAutoIncrement[boolean] - if true value of this field will be auto incremented
3. [**Optional**] isPrimaryKey[boolean] - if true this field will be primary key
4. [**Optional**] isUnique[boolean] - if true this field must be contain only unique values
5. [**Optional**] isUnsigned[boolean] - if true and type is one of number types field will be unsigned number
6. [**Optional**] isNotNull[boolean] - if true this field can't have null value
7. [**Optional**] check[[_Expressions_](#expressions)] - you may set check filter for inset data
8. [**Optional**] default[T] - you may set default value
9. [**Optional**] stringLen[number] - if type is VARCHAR or CHAR this field must contain varchar length
10. [**Optional**] enumSetValues[T[]] - if type is ENUM or SET this field must contain accept values

```ts
interface FieldConfig<T extends ValidSQLType> {
	readonly type: SQLTypes;
	readonly isAutoIncrement?: boolean;
	readonly isPrimaryKey?: boolean;
	readonly isUnique?: boolean;
	readonly isUnsigned?: boolean;
	readonly isNotNull?: boolean;
	readonly check?: Expressions<T>;
	readonly default?: T;

	readonly stringLen?: number;
	readonly enumSetValues?: T[];
}
```

#### SQLTypes

It's alias which contains supported SQL types for a field

**Values:**
It's the same as type in mysql/mariadb

```ts
type SQLTypes =
	/* NUMBERS */
	| "TINYINT"
	| "SMALLINT"
	| "MEDIUMINT"
	| "INT"
	| "BIGINT"
	| "DECIMAL"
	| "FLOAT"
	| "DOUBLE"
	| "BOOL"

	/* TEXT */
	| "VARCHAR"
	| "CHAR"
	| "TINYTEXT"
	| "TEXT"
	| "MEDIUMTEXT"
	| "LARGETEXT"

	/* DATE */
	| "DATE"
	| "TIME"
	| "DATETIME"
	| "YEAR"
	| "TIMESTAMP"

	/* COMPLEX */
	| "ENUM"
	| "NULL"
	| "SET"

	/* BIN */
	| "TINYBLOB"
	| "BLOB"
	| "MEDIUMBLOB"
	| "LARGEBLOB";
```

#### Expressions

It's generic alias which describe expression. It may be one expression, expression array(expression will be joined with 'and') and expression matrix(arrays will be joined with 'or' and inner array will be joined with 'and')

**Values:**
Alias for [_Expression_](#expression),_Expression_[] ans _Expression_[][]

```ts
type Expressions<T extends ValidSQLType> =
	| Expression<T>
	| Expression<T>[]
	| Expression<T>[][];
```

#### ForeignKeys

It's a generic type which contains references on any tables fields

**Fields:**

1. [**Optional**] _FieldName_[[_Reference_](#reference)] - foreign key of this field

```ts
type ForeignKeys<TF extends AnyObject> = {
	readonly [key in keyof TF]?: Reference;
};
```

#### Expression

It's generic object that describes logic expression

**Values:**

1. [**Requires**] operator[[_Operators_](#operators)] - operator of expression
2. [**Optional**] value[_T_] - right operand
3. [**Optional**] not[_boolean_] - invert
4. [**Optional**] template[_string_]] - template for regular expression

```ts
interface Expression<T extends ValidSQLType> {
	readonly operator: Operators;
	readonly value?: T | T[];
	readonly not?: boolean;
	readonly template?: string;
}
```

#### Operators

It'a alias of allowed operators used for choosing operator in expression

```ts
type Operators =
	| "="
	| "<"
	| "<="
	| ">"
	| ">="
	| "!="
	| "between"
	| "in"
	| "like"
	| "regExp"
	| "is null";
```

#### Reference

It's an interface which describes foreign key of this field

**Fields:**

1. [**Require**] tableName[string] - name of another table
2. [**Require**] field[string] - field of another table
3. [**Optional**] onUpdate[string] - what must happened on update
4. [**Optional**] onDelete[string] - what must happened on delete

```ts
interface Reference {
	readonly tableName: string;
	readonly field: string;
	readonly onUpdate?: ChangeType;
	readonly onDelete?: ChangeType;
}
```

#### ChangeType

It's alias of allowed types of changing foreign keys

```ts
type ChangeType =
	| "CASCADE"
	| "SET NULL"
	| "RESTRICT"
	| "NO ACTION"
	| "SET DEFAULT";
```

#### Query

It's a generic interface contains config of request.

**Fields:**

1. [**Optional**] filters[[_TableFilters_](#tablefilters)] - filters of request
2. [**Optional**] orderBy[[_Ordering_](#orderby)] - setting of ordering response
3. [**Optional**] limit[[_TablePage_](#limit)] - set limit of request
4. [**Optional**] groupBy[[_Ordering_](#groupBy)] - setting of grouping response

```ts
interface Query<TF extends AnyObject> {
	readonly filters?: TableFilters<TF> | TableFilters<TF>[];
	readonly orderBy?: OrderBy<TF>;
	readonly limit?: Limit;
	readonly groupBy?: GroupBy<TF> | MappedObject<GroupBy<AnyObject>>;
}
```

#### TableFilters

It's a generic type contains filters for any table filed.

**Fields:**

1. [**Optional**] _FieldName_[[_Expressions_](#expressions)] - describe filters for includes values in response(equal where directive in sql)

```ts
type TableFilters<TF extends AnyObject> = {
	readonly [key in keyof TF]?: Expressions<TF[key]>;
};
```

#### Limit

It's an interface sets limit for a response.

**Fields:**

1. [**Require**] page[number] - number of page
2. [**Require**] countOnPage[number] - max count rows in a response

```ts
interface Limit {
	readonly page: number;
	readonly countOnPage: number;
}
```

#### GroupBy

It's alias described fields for group.

```ts
type GroupBy<TF extends AnyObject> = Array<keyof TF>;
```

#### OrderBy

It's an interface described ordering in response

```ts
type OrderBy<TF extends AnyObject> = {
	readonly [key in keyof TF]?: OrderDirection;
};
```

#### Ordering

It's a generic type contains ordering sort type for fields

**Fields:**

1. [**Optional**] _FieldName_[[_OrderingDirection_](#orderingdirection)] - direction of ordering

```ts
type Ordering<TF extends AnyObject> = {
	readonly [key in keyof TF]?: OrderingDirection;
};
```

#### OrderingDirection

It's an alias which can be only "DESC" or "ASC".

**Values:**

_DESC_ - data in response will be sorted from more to less
_ASC_ - data in response will be sorted from less to more

```ts
type OrderingDirection = "DESC" | "ASC";
```

#### SelectQuery

It's a generic interface contains config of select request and extends [[_Query_](#query)]

**Fields:**

1. [**Optional**] joinedTable[[_JoinTable_](#jointable)] - tables which also should include
2. [**Optional**] excludes[[_ExcludeFields_](#excludefields)|MappedObject&lt;ExcludeFields&gt;] - field which will be excluded, if it's a MappedObject Key must be table names and value is excluded fields
3. [**Optional**] includes[[_IncludesFields_](#includesfields)|MappedObject&lt;IncludesFields&gt;] - only this fields will be included in response. If is's a MappedObject key must be a table name and value must be included fields
<!-- This field will be reworked -->
4. [**Optional**] count[[_Count_](#count)|MappedObject&lt;Count&gt;] - describe count function in request. If it's a MappedObject key must be a table name and values must be a count
5. [**Optional**] distinct[_boolean_] - setting of grouping response

```ts
interface SelectQuery<TF extends AnyObject> extends Query<TF> {
	readonly joinedTable?: JoinTable;
	readonly excludes?:
		| ExcludeFields<TF>
		| MappedObject<ExcludeFields<AnyObject>>;
	readonly includes?:
		| IncludeFields<TF>
		| MappedObject<IncludeFields<AnyObject>>;
	readonly count?: Count<TF> | MappedObject<Count<AnyObject>>;
	readonly distinct?: boolean;
}
```

#### JoinTable

Is's an interface describe joining table in select request

**Fields:**

1. [**Required**] enable[_boolean_] - if true passed table will be joined and won't in others ways
2. [**Optional**] joinTable[_Array&lt;[Join](#join)|string&gt;_] - array that contain join objects or table names which should joined
3. [**Optional**] recurseInclude[_boolean_] - if true will be included table which has foreign keys in included tables and won't others ways

```ts
interface JoinTable {
	readonly enable: boolean;
	readonly joinTable?: Array<Join | string>;
	readonly recurseInclude?: boolean;
}
```

#### Join

Is's a type which describe advanced join of table.

**Fields:**

1. [**Require**] table[string] - name joined table
2. [**Optional**] invert[boolean] - if true for join will be used foreign key from second table(that name passed in table field) and won't others ways

#### ExcludeFields

It's a generic type for string array which describe excluded fields

```ts
type ExcludeFields<TF extends AnyObject> = Array<keyof TF>;
```

#### IncludeFields

It's a generic type for array of string or [[_AssociateField_](#associatefield)] which describe included fields

```ts
type IncludeFields<TF extends AnyObject> = Array<AssociateField<TF> | keyof TF>;
```

#### AssociateField

It's a generic alias for Tuple consisting from 2 string, where first is a field name and second it's a name in the response

```ts
type AssociateField<TF extends AnyObject> = [keyof TF, string];
```

#### Count

It's an array of [_[AssociateField](#associatefield)_] which describes count function

```ts
type Count<TF extends AnyObject> = Array<AssociateField<TF, "*">>;
```

#### MappedObject

It's a generic alias for object where key it's a string and value is's a passed type

```ts
type MappedObject<T> = {
	[key: string]: T;
};
```

#### AlterTableRequest

It's a generic alias for several variants of alter request: [AddColumn](#addcolumn), [DropColumn](#dropcolumn), [ModifyColumn](#modifycolumn), [AlterColumn](#altercolumn), [AddForeignKey](#addforeignkey), [DropForeignKey](#dropforeignkey), [AddPrimaryKey](#addprimarykey) and [DropPrimaryKey](#dropprimarykey)

```ts
type AlterTableRequest<T extends ValidSQLType, TF extends AnyObject> =
	| AddColumn<T>
	| DropColumn<TF>
	| ModifyColumn<TF, T>
	| AlterColumn<TF, T>
	| AddForeignKey<TF>
	| DropForeignKey<TF>
	| AddPrimaryKey<TF>
	| DropPrimaryKey;
```

#### AddColumn

It's a generic type describes request for add column

**Fields:**

1. [**Require**] type[_ADD COLUMN_] - type of alter request
2. [**Require**] fieldName[_string_] - name of new field
3. [**Require**] field[_[AlterFieldConfig](#alterfieldconfig)_] - config of new field

```ts
interface AddColumn<T extends ValidSQLType> {
	readonly type: "ADD COLUMN";
	readonly fieldName: string;
	readonly field: AlterFieldConfig<T>;
}
```

#### DropColumn

It's a generic type describes request for drop column

**Fields:**

1. [**Require**] type[_DROP COLUMN_] - type of alter request
2. [**Require**] fieldName[_string_] - name of drop field

```ts
interface DropColumn<TF extends AnyObject> {
	readonly type: "DROP COLUMN";
	readonly fieldName: keyof TF;
}
```

#### ModifyColumn

It's a generic type describes request for modification column

**Fields:**

1. [**Require**] type[_MODIFY COLUMN_] - type of alter request
2. [**Require**] fieldName[_string_] - name of changing field
3. [**Require**] field[_[AlterFieldConfig](#alterfieldconfig)_] - new config of field

```ts
interface ModifyColumn<TF extends AnyObject, T extends ValidSQLType> {
	readonly type: "MODIFY COLUMN";
	readonly fieldName: keyof TF;
	readonly field: AlterFieldConfig<T>;
}
```

#### AlterColumn

It's a generic type describes request for set default value

**Fields:**

1. [**Require**] type[_ALTER COLUMN_] - type of alter request
2. [**Require**] fieldName[_string_] - name of field
3. [**Require**] default[_T_] - new default value

```ts
interface AlterColumn<TF extends AnyObject, T extends ValidSQLType> {
	readonly type: "ALTER COLUMN";
	readonly fieldName: keyof TF;
	readonly default: T;
}
```

#### AddForeignKey

It's a generic type describes request for add foreign key

**Fields:**

1. [**Require**] type[_ADD FOREIGN KEY_] - type of alter request
2. [**Require**] fieldName[_string_] - name of field
3. [**Require**] reference[_[Reference](#reference)_] - reference on outer table

```ts
interface AddForeignKey<TF extends AnyObject> {
	readonly type: "ADD FOREIGN KEY";
	readonly fieldName: keyof TF;
	readonly reference: Reference;
}
```

#### DropForeignKey

It's a generic type describes request for drop foreign key

**Fields:**

1. [**Require**] type[_DROP FOREIGN KEY_] - type of alter request
2. [**Require**] fieldName[_string_] - name of field

```ts
interface DropForeignKey<TF extends AnyObject> {
	readonly type: "DROP FOREIGN KEY";
	readonly fieldName: keyof TF;
}
```

#### AddPrimaryKey

It's a generic type describes request for add primary key

**Fields:**

1. [**Require**] type[_ADD PRIMARY KEY_] - type of alter request
2. [**Require**] fieldName[_string_] - name of field

```ts
interface AddPrimaryKey<TF extends AnyObject> {
	readonly type: "ADD PRIMARY KEY";
	readonly fieldNames: keyof TF[];
}
```

#### DropPrimaryKey

It's a generic type describes request for drop primary key

**Fields:**

1. [**Require**] type[_DROP PRIMARY KEY_] - type of alter request

```ts
interface DropPrimaryKey {
	readonly type: "DROP PRIMARY KEY";
}
```

#### AlterFieldConfig

It's alias for special config used in alter requests

```ts
type AlterFieldConfig<T extends ValidSQLType> = Omit<
	FieldConfig<T>,
	"isPrimaryKey" | "default"
>;
```

#### Description

It's a generic type describes description which is returned from Table.describe

**Fields:**

1. [**Require**] Field[_string_] - field name
2. [**Require**] Type[_string_] - type
3. [**Require**] Null[_Yes|No_] - may be null
4. [**Require**] Key[_string_] - type of key
5. [**Require**] Default[_[ValidSQLType](#validsqltype)_] - default value
6. [**Require**] Extra[_string_] - extra modifiers

```ts
interface Description<TF extends AnyObject> {
	readonly Field: keyof TF;
	readonly Type: string;
	readonly Null: "YES" | "NO";
	readonly Key: "PRI" | "";
	readonly Default: ValidSQLType | null;
	readonly Extra: string;
}
```

### Errors

In progress
