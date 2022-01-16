# Mariadb table wrapper

Library for easy using mariadb on nodejs

Content:

- [Introduction](#introduction)
- [Installation](#installation)
- [Documentation](#documentation)

## Introduction

**Mariadb** is a popular fork of the more popular DBSM MySql. However, mariadb has mariadb node connector which **is not very comfortable**. Because you have to every time translate JS to SQL. It's very uncomfortable. **Mariadb table wrapper** is comfortable way to use mariadb. Is provided a **useful API** for your node app or server on it. If you don't have enough opportunities, so library provides a standard function of mariadb.

## Installation

```sh
  npm install mariadb-table-wrapper
```

## Documentation

### Chapters

- [Connection](#connection)
- [Table](#table)
  - [_Constructor_](#constructor)
  - [_Initialization_](#initialization)
  - [_Insert data to table_](#insert)
  - [_Select data from table_](#select-and-selectone)
  - [_Delete data from table_](#delete)
  - [_Update data in table_](#update)
  - [_Drop, truncate, delete all_](#drop)
- [Types](#types)
  - [_TableConfig_](#tableconfig)
  - [_Fields_](#fields)
  - [_FieldConfig_](#fieldconfig)
  - [_SQLTypes_](#sqltypes)
  - [_ForeignKeys_](#foreignkeys)
  - [_Reference_](#reference)
  - [_TableSelectRequestConfig_](#tableselectrequestconfig)
  - [_TableFilters_](#tablefilters)
  - [_TablePage_](#tablepage)
  - [_ExcludeFields_](#excludefields)
  - [_IncludeFields_](#includefields)
  - [_AssociateFields_](#associatefields)
  - [_Ordering_](#ordering)
  - [_OrderingDirection_](#orderingdirection)
- [Errors](#errors)

#### Connection

For connection to the database library provides several mariadb function: [createConnection](https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md#createconnectionoptions--promise), [createPool](https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md#createpooloptions--pool) and [createPoolCluster](https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md#createpoolclusteroptions--poolcluster). With which you can get a connection.

#### Table

##### Constructor

Table constructor waits config of table as a require parameter

```js
import { Table, SQLTypes } from "mariadb-table-wrapper";

const anyTable = new Table({
 table: "tableName",

 fields: {
  someField: {
   type: SQLTypes.BOOL,
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
import { Table, SQLTypes } from "mariadb-table-wrapper";

interface TableInterface {
 anyId: number;
 name: string;
}
const anyTable = new Table<TableInterface>({
 table: "tableName",

 fields: {
  anyId: {
   type: SQLTypes.SMALLINT,
   isPrimaryKey: true,
  },
  name: {
   type: SQLTypes.VARCHAR,
   varcharLen: 64,
  },
 },
});
```

**Parameters:**

1. [**Require**] config[[_TableConfig_](#tableconfig)] - config of the table

##### Initialization

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

##### Insert

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

##### Select and selectOne

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
await anyTab.selectOn({
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

1. [**Optional**] config[[_TableSelectRequestConfig_](#tableselectrequestconfig)] - options for select data from table

##### Delete

For delete any row from the table Table instance has a delete method. This method returns a Promise which resolves to void.

```js
await anyTab.delete({
 /* Delete filters */
});
```

In TS you needn't to pass interface

**Parameters:**

1. [**Require**] filters[[_TableFilters_](#tablefilters)] - filters select data which will be deleted

##### Update

For update data in the table Table instance has an update method. This method returns Promise which resolves to void

```js
await anyTable.update(
 {
  /* New values for table data */
 },
 {
  /* Filters */
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
  /* Filters */
 }
);
```

**Parameters:**

1. [**Require**] newValues[_AnyObject | AnyNewValues_] - values which will be written
2. [**Require**] filters[[_TableFilters_](#tablefilters)] - filters select target rows

##### Drop

For delete all data from table Table instance provide three method - truncate, drop and deleteAll
Truncate does truncate for this table, drop does drop for this table and deleteAll delete all rows from this table

```js
await anyTable.deleteAll();
await anyTable.truncate();
await anyTable.drop();
```

**Parameters:**
Don't have parameters

#### Types

##### TableConfig

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

##### Fields

It's a generic interface which describes fields in table config.

**Fields:**

1. [**Require**] _tableFieldName_[[_FieldConfig_](#fieldconfig)] - config of the table field

```ts
type Fields<TF> = {
 readonly [key in keyof TF]: FieldConfig;
};
```

##### FieldConfig

It's an interface which contains describe of the table field

**Fields:**

1. [**Require**] type[[_SQLTypes_](#sqltypes)] - one of supported SQL types
2. [**Optional**] isAutoIncrement[boolean] - if true value of this field will be auto incremented
3. [**Optional**] isPrimary[boolean] - if true this field will be primary key
4. [**Optional**] isUnique[boolean] - if true this field must be contain only unique values
5. [**Optional**] isUnsigned[boolean] - if true and type is one of number types field will be unsigned number
6. [**Optional**] isNotNull[boolean] - if true this field can't have null value
7. [**Require**] varcharLen[number] - if type is VARCHAR this field must contain varchar length
8. [**Require**] enumValues[string[]] - if type is ENUM this field must contain accept values

```ts
interface FieldConfig {
 readonly type: SQLTypes;
 readonly isAutoIncrement?: boolean;
 readonly isPrimaryKey?: boolean;
 readonly isUnique?: boolean;
 readonly isUnsigned?: boolean;
 readonly isNotNull?: boolean;

 readonly varcharLen?: number;
 readonly enumValues?: string[];
}
```

##### SQLTypes

It's enum which contains supported SQL types for a field

**Values:**

1. _ENUM_ - enum
2. _SMALLINT_ - smallint
3. _VARCHAR_ - varchar
4. _BOOLEAN_ - boolean

```ts
enum SQLTypes {
 SMALLINT = "SMALLINT",
 VARCHAR = "VARCHAR",
 DATE = "DATE",
 BOOLEAN = "BOOL",
 ENUM = "ENUM",
}
```

##### ForeignKeys

It's a generic type which contains references on any tables fields

**Fields:**

1. [**Optional**] _FieldName_[[_Reference_](#reference)] - foreign key of this field

```ts
type ForeignKeys<TF extends AnyObject> = {
 readonly [key in keyof TF]?: Reference;
};
```

##### Reference

It's an interface which describes foreign key of this field

**Fields:**

1. [**Require**] tableName[string] - name of another table
2. [**Require**] field[string] - field of another table

```ts
interface Reference {
 readonly tableName: string;
 readonly field: string;
}
```

##### TableSelectRequestConfig

It's a generic interface contains config of select request.

**Fields:**

1. [**Optional**] filters[[_TableFilters_](#tablefilters)] - filters of select request
2. [**Optional**] join[boolean] - if true the response will be with data from foreign keys tables
3. [**Optional**] joinedTable[string[]] - if join is true in this field may to pass joined table, response will include all foreign keys table
4. [**Optional**] page[[_TablePage_](#tablepage)] - set page of request(use for limit)
5. [**Optional**] excludes[[_ExcludeFields_](#excludefields)] - exclude any fields from response (may be use only without includes)
6. [**Optional**] includes[[_IncludeFields_](#includefields)] - includes only this fields to the response(may be use only without excludes)
7. [**Optional**] ordering[[_Ordering_](#ordering)] - setting of ordering response

```ts
interface TableSelectRequestConfig<TF extends AnyObject> {
 readonly filters?: TableFilters<TF>;
 readonly join?: boolean;
 readonly joinedTable?: string[];
 readonly page?: TablePage;
 readonly excludes?: ExcludeFields<TF>;
 readonly includes?: IncludeFields<TF>;
 readonly ordering?: Ordering<TF>;
}
```

##### TableFilters

It's a generic type contains filters for any table filed.

**Fields:**

1. [**Optional**] _FieldName_[_string | string[]_] - includes value. If it's a string so will be includes fields with only equals values. If is's an array will be includes fields have one of these values

```ts
type TableFilters<TF extends AnyObject> = {
 readonly [key in keyof TF]?: TF[key] | TF[key][];
};
```

##### TablePage

It's an interface sets limit for a response.

**Fields:**

1. [**Require**] page[number] - number of page
2. [**Require**] countOnPage[number] - max count rows in a response

```ts
interface TablePage {
 readonly page: number;
 readonly countOnPage: number;
}
```

##### ExcludeFields

It's a generic type which can be an array of keys of passed object or an object where key is a table name and value is an exclude fields name

```ts
type ExcludeFields<TF extends AnyObject> =
 | Array<keyof TF>
 | JoinedExcludeFields;
```

##### IncludesFields

It's a generic type which can be an array os keys of passed object or an array of [_AssociateField_](#associatefield). Also it can be an object where key is a table name and value is an array of that table field or [_AssociateField_](#associatefield)

```ts
type IncludeFields<TF extends AnyObject> =
 | Array<AssociateField<TF> | keyof TF>
 | JoinedIncludeFields;
```

###### AssociateField

It's a generic alias for Tuple consisting from 2 string, where first is a field name and second it's a name in the response

```ts
type AssociateField<TF extends AnyObject> = [keyof TF, string];
```

##### Ordering

It's a generic type contains ordering sort type for fields

**Fields:**

1. [**Optional**] _FieldName_[[_OrderingDirection_](#orderingdirection)] - direction of ordering

```ts
type Ordering<TF extends AnyObject> = {
 readonly [key in keyof TF]?: OrderingDirection;
};
```

##### OrderingDirection

It's an alias which can be only "DESC" or "ASC".

**Values:**

_DESC_ - data in response will be sorted from more to less
_ASC_ - data in response will be sorted from less to more

```ts
type OrderingDirection = "DESC" | "ASC";
```

#### Errors

In progress
