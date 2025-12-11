import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// db
export const DbToken = createTokenByName("db", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// query
export const QueryToken = createTokenByName("query", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// get
export const GetToken = createTokenByName("get", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// add
export const AddToken = createTokenByName("add", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// add_or_edit
export const AddOrEditToken = createTokenByName("add_or_edit", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// del (stands for delete)
export const DelToken = createTokenByName("del", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// delete
export const DeleteToken = createTokenByName("delete", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// edit
export const EditToken = createTokenByName("edit", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// update --- weirdly enough we have db.batch.update and db.edit
export const UpdateToken = createTokenByName("update", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// has
export const HasToken = createTokenByName("has", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// patch
export const PatchToken = createTokenByName("patch", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// schema
export const SchemaToken = createTokenByName("schema", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// transaction
export const TransactionToken = createTokenByName("transaction", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// truncate
export const TruncateToken = createTokenByName("truncate", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// direct_query
export const DirectQueryToken = createTokenByName("direct_query", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// set_datasource
export const SetDatasourceToken = createTokenByName("set_datasource", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// bulk
export const BulkToken = createTokenByName("bulk", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// db.external
export const ExternalToken = createTokenByName("external", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// db.external.mssql
export const MssqlToken = createTokenByName("mssql", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// db.external.mysql
export const MysqlToken = createTokenByName("mysql", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// db.external.postgres
export const PostgresToken = createTokenByName("postgres", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// db.external.oracle
export const OracleToken = createTokenByName("oracle", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const DbTokens = [
  DbToken,
  QueryToken,
  GetToken,
  AddOrEditToken,
  AddToken,
  DeleteToken,
  DelToken,
  EditToken,
  UpdateToken,
  HasToken,
  PatchToken,
  SchemaToken,
  TransactionToken,
  TruncateToken,
  DirectQueryToken,
  SetDatasourceToken,
  BulkToken,
  ExternalToken,
  MssqlToken,
  MysqlToken,
  PostgresToken,
  OracleToken,
];

export function mapTokenToType(token) {
  switch (token) {
    case SchemaToken.name:
      return "keyword";
    case DbToken.name:
    case BulkToken.name:
    case ExternalToken.name:
    case MssqlToken.name:
    case MysqlToken.name:
    case PostgresToken.name:
    case OracleToken.name:
    case QueryToken.name:
    case GetToken.name:
    case AddToken.name:
    case AddOrEditToken.name:
    case DeleteToken.name:
    case DelToken.name:
    case EditToken.name:
    case UpdateToken.name:
    case HasToken.name:
    case PatchToken.name:
    case TransactionToken.name:
    case TruncateToken.name:
    case DirectQueryToken.name:
    case SetDatasourceToken.name:
      return "function";
    default:
      return null;
  }
}
