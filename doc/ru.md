# Документация

## Главы

- [Подключение](#подключение)
- [Таблица](#таблица)
  - [_Конструктор_](#конструктор)
  - [_Инициализация_](#инициализация)
  - [_Внесение данных_](#внесение)
  - [_Выборка данных_](#выборка)
  - [_Удаление данных_](#удаление)
  - [_Обновление данных_](#обновление)
  - [_Удаление всех данных_](#сброс)
  - [_Описание таблицы_](#описание)
  - [_Изменение структуры_](#структура)
- [Типы](#типы)
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
- [Ошибки](#ошибки)

### Подключение

Для подключение к базе данных библиотека предоставляется несколько функций: [createConnection](https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md#createconnectionoptions--promise), [createPool](https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md#createpooloptions--pool) and [createPoolCluster](https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md#createpoolclusteroptions--poolcluster). With which you can get a connection.

### Таблица

#### Конструктор

Конструктор таблицы ожидает конфигурацию таблицы, как обязательный параметр

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

Также в TypeScript вы должны предоставить интерфейс таблицы. Каждое поле из передаваемого интерфейса должно быть описано в конфигурации

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

**Параметры:**

1. [**Обязательный**] config[[_TableConfig_](#tableconfig)] - конфиг таблицы

**Возвращает:**

Экземпляр таблицы

#### Инициализация

Перед тем как вы сможете использовать таблицу, ее нужно инициализировать. Для этого нужно вызвать метод _init_ с параметром типа [connection](https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md#connection-api)

```js
import { createConnection } from "mariadb-table-wrapper";

const connection = await createConnection({
	/* Опции подключения */
});
await anyTable.init(connection);
```

Во время вызова данного метода происходит создание таблицы в БД

#### Внесение

Для внесения данных в таблицу, экземпляр класса Table предоставляет метод _insert_

```js
await anyTable.insert({
	/* Ваши вносимые данные */
});
// or
await anyTable.insert([/* Ваши вносимые данные */ {}, {}]);
```

В TypeScript вы можете передать интерфейс для вносимых данных

```ts
interface AnyInsertInterface {
	/* Описание интерфейса */
}

await anyTable.insert<AnyInsertInterface>({
	/* Ваши вносимые данные, соответствующие интерфейсу */
});
// or
await anyTable.insert<AnyInsertInterface>([
	{
		/* Ваши вносимые данные, соответствующие интерфейсу */
	},
	{
		/* Ваши вносимые данные, соответствующие интерфейсу */
	},
]);
```

**Параметры:**

1. [**Обязательный**] values[_T_ | _T[]_] - данные, которые будут внесены в таблицу

**Возвращает:**
Promise, разрешающийся в void

#### Выборка

Для выборки данных из таблицы предоставляется метод _select_

```js
await anyTab.select({
	/* Конфиг выборки */
});
```

В TypeScript по умолчанию данные имеют интерфейс таблицы, но так же может быть передан другой интерфейс

```ts
/*  */
interface AnyAnotherResponse {
	/* Интерфейс ответа */
}
await anyTable.select<AnyAnotherResponse>({
	/* Конфиг выборки */
});
```

Для выборки только одной строки используется метод _selectOne_

```js
await anyTab.selectOne({
	/* Конфиг выборки */
});
```

```ts
/*  */
interface AnyAnotherResponse {
	/* Интерфейс ответа */
}
await anyTable.selectOne<AnyAnotherResponse>({
	/* Конфиг выборки */
});
```

**Параметры:**

1. [**Опциональный**] config[[_SelectConfig_](#selectquery)] - конфиг выборки данных

**Возвращает**
Promise разрешающийся в тип таблицы или переданный интерфейс. При использовании метода _selectOne_, возможен возврат undefined, если ни одна запись не была выбрана

#### Удаление

Для удаления записей из таблицы используется метод _delete_

```js
await anyTab.delete({
	/* Конфигурация удаления */
});
```

**Параметры:**

1. [**Опциональный**] config[[_Query_](#query)] - конфигурация запроса на удаление

**Возвращает**
Promise, разрешающийся в void

#### Обновление

Для обновления данных в таблице используется метод _update_

```js
await anyTable.update(
	{
		/* Новые значения */
	},
	{
		/* Конфиг запроса */
	}
);
```

В TypeScript вы должны передать интерфейс для вносимых данных

```ts
interface AnyNewValues {
	/* Интерфейс для новых значений */
}

await anyTable.update<AnyNewValues>(
	{
		/* Новые значения */
	},
	{
		/* Конфиг запроса */
	}
);
```

**Параметры:**

1. [**Обязательный**] newValues[_AnyObject | AnyNewValues_] - значения, на которые будут обновлены
2. [**Опциональный**] config[[_Query_](#query)] - конфиг запроса, выбирающий записи для обновления

**Возвращает:**
Promise, разрешающийся в void

#### Сброс

Для удаления всех данных из таблица используются два метода - _drop_ и _truncate_

```js
await anyTable.truncate();
await anyTable.drop();
```

**Параметры:**
Нет параметров

**Возвращает:**
Promise, разрешающийся в void

#### Описание

Для получения описания структура таблицы используется метод _desc_

```js
await anyTable.describe();
```

**Параметры:**
Нет параметров

**Возвращает:**
Promise, разрешающийся в массив с типом [Description](#description)

#### Структура

ДЛя изменения структуры таблицы используется метод _alter_

```js
await anyTable.alter({
	/* Конфиг изменения структуры */
});
```

**Параметры:**

1. [**Обязательный**] params[_[AlterTableRequest](#altertablerequest)|AlterTableRequest[]_] - описание изменения структуры

**Возвращает:**
Promise, разрешающийся в void

### Типы

#### TableConfig

Это дженерик, описывающий конфиг таблицы

**Поля:**

1. [**Обязательный**] table[string] - название таблицы
2. [**Обязательный**] fields[[_Fields_](#fields)] - объект, описывающий поля таблицы
3. [**Опциональный**] safeCreation[boolean] - если значение true, то в методе [init](#инициализация) будет добавлена строка IF NOT EXISTS
4. [**Опциональный**] foreignKeys[[_ForeignKeys_](#foreignkeys)] - объект, описывающий внешние ключи

```ts
interface TableConfig<TF extends AnyObject> {
	readonly table: string;
	readonly fields: Fields<TF>;
	readonly safeCreating?: boolean;
	readonly foreignKeys?: ForeignKeys<TF>;
}
```

#### Fields

Это дженерик, описывающий поля таблицы

**Поля:**

1. [**Обязательный**] _tableFieldName_[[_FieldConfig_](#fieldconfig)] - конфиг поля

```ts
type Fields<TF> = {
	readonly [key in keyof TF]: FieldConfig<TF[key]>;
};
```

#### FieldConfig

Это дженерик, описывающий поле

**Поля:**

1. [**Обязательный**] type[[_SQLTypes_](#sqltypes)] - тип поля
2. [**Опциональный**] isAutoIncrement[boolean] - автоинкремент
3. [**Опциональный**] isPrimaryKey[boolean] - первичный ключ
4. [**Опциональный**] isUnique[boolean] - только уникальные
5. [**Опциональный**] isUnsigned[boolean] - беззнаковое число
6. [**Опциональный**] isNotNull[boolean] - может ли быть нулем
7. [**Опциональный**] check[[_Expressions_](#expressions)] - проверка перед внесением данных
8. [**Опциональный**] default[T] - значение по умолчанию
9. [**Опциональный**] stringLen[number] - длинна строки, если выбран тип VARCHAR или CHAR
10. [**Опциональный**] enumSetValues[T[]] - значения для ENUM или SET

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

Это элиас, содержащий поддерживаемые типы данных

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

Дженерик элиас, описывающий логические выражения. Это может быть одно выражение(объект), массив(его элементы будут объединены оператором и) или матрица(внутренние элементы объединяются с помощью и, а внешние через или)


```ts
type Expressions<T extends ValidSQLType> =
	| Expression<T>
	| Expression<T>[]
	| Expression<T>[][];
```

#### ForeignKeys

Дженерик, описывающий внешнюю связь в таблице

**Поля:**

1. [**Опциональный**] _FieldName_[[_Reference_](#reference)] - ссылка на таблицу

```ts
type ForeignKeys<TF extends AnyObject> = {
	readonly [key in keyof TF]?: Reference;
};
```

#### Expression

Дженерик, описывающий логическое выражение

**Значения:**

1. [**Обязательный**] operator[[_Operators_](#operators)] - оператор выражения
2. [**Опциональный**] value[_T_] - правый операнд
3. [**Опциональный**] not[_boolean_] - инверсия
4. [**Опциональный**] template[_string_]] - шаблон для регулярного выражения

```ts
interface Expression<T extends ValidSQLType> {
	readonly operator: Operators;
	readonly value?: T | T[];
	readonly not?: boolean;
	readonly template?: string;
}
```

#### Operators

Это элиаc допустимых операторов

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

Объект, описывающий ссылку на внешнюю таблицу

**Поля:**

1. [**Обязательный**] tableName[string] - имя внешней таблицы
2. [**Обязательный**] field[string] - поле внешней таблицы
3. [**Опциональный**] onUpdate[string] - поведение на обновление
4. [**Опциональный**] onDelete[string] - поведение на удаление

```ts
interface Reference {
	readonly tableName: string;
	readonly field: string;
	readonly onUpdate?: ChangeType;
	readonly onDelete?: ChangeType;
}
```

#### ChangeType

Элиас, содержащий допустимое поведение

```ts
type ChangeType =
	| "CASCADE"
	| "SET NULL"
	| "RESTRICT"
	| "NO ACTION"
	| "SET DEFAULT";
```

#### Query

Дженерик, описывающий базовый запрос

**Поля:**

1. [**Опциональный**] filters[[_TableFilters_](#tablefilters)] - фильтры
2. [**Опциональный**] orderBy[[_Ordering_](#orderby)] - порядок сортировки
3. [**Опциональный**] limit[[_TablePage_](#limit)] - предел выборки
4. [**Опциональный**] groupBy[[_Ordering_](#groupBy)] - группировка

```ts
interface Query<TF extends AnyObject> {
	readonly filters?: TableFilters<TF> | TableFilters<TF>[];
	readonly orderBy?: OrderBy<TF>;
	readonly limit?: Limit;
	readonly groupBy?: GroupBy<TF> | MappedObject<GroupBy<AnyObject>>;
}
```

#### TableFilters

Объект фильтров запроса

**Поля:**

1. [**Опциональный**] _FieldName_[[_Expressions_](#expressions)] - фильтр конкретного поля

```ts
type TableFilters<TF extends AnyObject> = {
	readonly [key in keyof TF]?: Expressions<TF[key]>;
};
```

#### Limit

Объект, описывающий предел выборки

**Поля:**

1. [**Обязательный**] page[number] - страница смещения
2. [**Обязательный**] countOnPage[number] - количество строк на странице

```ts
interface Limit {
	readonly page: number;
	readonly countOnPage: number;
}
```

#### GroupBy

Элиас, описывающий поля для группировки

```ts
type GroupBy<TF extends AnyObject> = Array<keyof TF>
```

#### OrderBy

Объект, описывающий сортировку в запросе

```ts
type OrderBy<TF extends AnyObject> = {
	readonly [key in keyof TF]?: OrderDirection;
};
```

#### OrderingDirection

Элиас, содержащий допустимые значения направления сортировки

**Значения**

_DESC_ - от большего к меньшему
_ASC_ - от меньшего к большему

```ts
type OrderingDirection = "DESC" | "ASC";
```

#### SelectQuery

Производный тип от [[_Query_](#query)], описывающий параметры запроса для выборки

**Поля:**

1. [**Опциональный**] joinedTable[[_JoinTable_](#jointable)] - таблицы, которые нужно присоединить
2. [**Опциональный**] excludes[[_ExcludeFields_](#excludefields)|MappedObject&lt;ExcludeFields&gt;] - поля, которые будут исключены из запроса
3. [**Опциональный**] includes[[_IncludesFields_](#includesfields)|MappedObject&lt;IncludesFields&gt;] - только эти поля будут включены в запрос
<!-- This field will be reworked -->
4. [**Опциональный**] count[[_Count_](#count)|MappedObject&lt;Count&gt;] - описание функции count
5. [**Опциональный**] distinct[_boolean_] - только уникальные записи

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

Интерфейс, описывающий соединение таблиц

**Поля:**

1. [**Обязательный**] enable[_boolean_] - включено ли соединение
2. [**Опциональный**] joinTable[_Array&lt;[Join](#join)|string&gt;_] - список включаемых таблиц
3. [**Опциональный**] recurseInclude[_boolean_] - должны ли таблицы соединяться рекурсивно

```ts
interface JoinTable {
	readonly enable: boolean;
	readonly joinTable?: Array<Join | string>;
	readonly recurseInclude?: boolean;
}
```

#### Join

Тип, описывающий включение таблицы

**Поля:**

1. [**Обязательный**] table[string] - имя таблицы
2. [**Опциональный**] invert[boolean] - инвертирована ли связь(является ли подсоединяемая таблица подчиненной)

#### ExcludeFields

Тип, описывающий исключаемые из запроса поля

```ts
type ExcludeFields<TF extends AnyObject> = Array<keyof TF>;
```

#### IncludeFields

Тип описывающий включаемые в запрос поля. Так же есть возможность переименовать поля

```ts
type IncludeFields<TF extends AnyObject> = Array<AssociateField<TF> | keyof TF>;
```

#### AssociateField

Кортеж, содержащий табличное и новое название поля

```ts
type AssociateField<TF extends AnyObject> = [keyof TF, string];
```

#### Count

Массив, описывающий, что нужно считать в запросе

```ts
type Count<TF extends AnyObject> = Array<AssociateField<TF, "*">>;
```

#### MappedObject

Обычный объект, где строка - ключ, а переданный тип - значение

```ts
type MappedObject<T> = {
	[key: string]: T;
};
```

#### AlterTableRequest

Элиас дженерик, соединяющий все запросы на изменение структуры таблицы: [AddColumn](#addcolumn), [DropColumn](#dropcolumn), [ModifyColumn](#modifycolumn), [AlterColumn](#altercolumn), [AddForeignKey](#addforeignkey), [DropForeignKey](#dropforeignkey), [AddPrimaryKey](#addprimarykey) and [DropPrimaryKey](#dropprimarykey)

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

Дженерик, описывающий запрос на добавление поля

**Поля:**

1. [**Обязательный**] type[_ADD COLUMN_] - тип запроса на ихменение структуры
2. [**Обязательный**] fieldName[_string_] - имя поля
3. [**Обязательный**] field[_[AlterFieldConfig](#alterfieldconfig)_] - конфиг нового поля

```ts
interface AddColumn<T extends ValidSQLType> {
	readonly type: "ADD COLUMN";
	readonly fieldName: string;
	readonly field: AlterFieldConfig<T>;
}
```

#### DropColumn

Дженерик, описывающий запрос на удаление поля

**Поля:**

1. [**Обязательный**] type[_DROP COLUMN_] - тип запроса на ихменение структуры
2. [**Обязательный**] fieldName[_string_] - имя поля

```ts
interface DropColumn<TF extends AnyObject> {
	readonly type: "DROP COLUMN";
	readonly fieldName: keyof TF;
}
```

#### ModifyColumn

Дженерик, описывающий запрос на изменение поля

**Поля:**

1. [**Обязательный**] type[_MODIFY COLUMN_] - тип запроса на ихменение структуры
2. [**Обязательный**] fieldName[_string_] - имя поля
3. [**Обязательный**] field[_[AlterFieldConfig](#alterfieldconfig)_] - новый конфиг поля

```ts
interface ModifyColumn<TF extends AnyObject, T extends ValidSQLType> {
	readonly type: "MODIFY COLUMN";
	readonly fieldName: keyof TF;
	readonly field: AlterFieldConfig<T>;
}
```

#### AlterColumn

Дженерик, описывающий запрос на изменения значения по умолчанию

**Поля:**

1. [**Обязательный**] type[_ALTER COLUMN_] - тип запроса на ихменение структуры
2. [**Обязательный**] fieldName[_string_] - имя поля
3. [**Обязательный**] default[_T_] - новое значение по умолчанию

```ts
interface AlterColumn<TF extends AnyObject, T extends ValidSQLType> {
	readonly type: "ALTER COLUMN";
	readonly fieldName: keyof TF;
	readonly default: T;
}
```

#### AddForeignKey

Дженерик, описывающий запрос на добавление внешнего ключа

**Поля:**

1. [**Обязательный**] type[_ADD FOREIGN KEY_] - тип запроса на ихменение структуры
2. [**Обязательный**] fieldName[_string_] - имя поля
3. [**Обязательный**] reference[_[Reference](#reference)_] - описание ссылки на таблицу

```ts
interface AddForeignKey<TF extends AnyObject> {
	readonly type: "ADD FOREIGN KEY";
	readonly fieldName: keyof TF;
	readonly reference: Reference;
}
```

#### DropForeignKey

Дженерик, описывающий запрос на сброс внешнего ключа

**Поля:**

1. [**Обязательный**] type[_DROP FOREIGN KEY_] - тип запроса на ихменение структуры
2. [**Обязательный**] fieldName[_string_] - имя поля

```ts
interface DropForeignKey<TF extends AnyObject> {
	readonly type: "DROP FOREIGN KEY";
	readonly fieldName: keyof TF;
}
```

#### AddPrimaryKey

Дженерик, описывающий запрос на добавление первичного(ых) ключей

**Поля:**

1. [**Обязательный**] type[_ADD PRIMARY KEY_] - тип запроса на ихменение структуры
2. [**Обязательный**] fieldName[_string_] - имя поля(ей)

```ts
interface AddPrimaryKey<TF extends AnyObject> {
	readonly type: "ADD PRIMARY KEY";
	readonly fieldNames: keyof TF[];
}
```

#### DropPrimaryKey

Дженерик, описывающий запрос на сброс первичного ключа

**Поля:**

1. [**Обязательный**] type[_DROP PRIMARY KEY_] - тип запроса на ихменение структуры

```ts
interface DropPrimaryKey {
	readonly type: "DROP PRIMARY KEY";
}
```

#### AlterFieldConfig

Элиас, описывающий тип поля в изменении структуры

```ts
type AlterFieldConfig<T extends ValidSQLType> = Omit<
	FieldConfig<T>,
	"isPrimaryKey" | "default"
>;
```

#### Description

Дженерик, описывающий поле, возвращаемое из метода describe

**Поля:**

1. [**Обязательный**] Field[_string_] - имя поля
2. [**Обязательный**] Type[_string_] - тип поля
3. [**Обязательный**] Null[_Yes|No_] - может ли быть null
4. [**Обязательный**] Key[_string_] - тип ключа
5. [**Обязательный**] Default[_[ValidSQLType](#validsqltype)_] - значение по умолчанию
6. [**Обязательный**] Extra[_string_] - экстра модификаторы

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

### Ошибки

В процессе
