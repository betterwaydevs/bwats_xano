import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// cloud
export const CloudToken = createTokenByName("cloud", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// cloud.algolia
export const AlgoliaToken = createTokenByName("algolia", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// cloud.google
export const GoogleToken = createTokenByName("google", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// cloud.aws
export const AwsToken = createTokenByName("aws", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// cloud.elasticsearch
export const ElasticsearchToken = createTokenByName("elasticsearch", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// cloud.azure
export const AzureToken = createTokenByName("azure", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// cloud.google.storage
// cloud.azure.storage
export const StorageToken = createTokenByName("storage", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// cloud.xxx.storage.read_file
export const ReadFileToken = createTokenByName("read_file", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// cloud.xxx.storage.delete_file
export const DeleteFileToken = createTokenByName("delete_file", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// cloud.xxx.storage.get_file_info
export const GetFileInfoToken = createTokenByName("get_file_info", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// cloud.google.storage.list_directory
export const ListDirectoryToken = createTokenByName("list_directory", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// cloud.aws.s3
export const S3Token = createTokenByName("s3", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// cloud.google.storage.sign_url
// cloud.aws.s3.sign_url
export const SignUrlToken = createTokenByName("sign_url", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// cloud.xxx.storage.upload_file
export const UploadFileToken = createTokenByName("upload_file", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// cloud.aws.opensearch
export const OpenSearchToken = createTokenByName("opensearch", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// cloud.aws.opensearch.document
export const DocumentToken = createTokenByName("document", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// cloud.aws.opensearch.query
export const QueryToken = createTokenByName("query", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// cloud.aws.opensearch.request
export const RequestToken = createTokenByName("request", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const CloudTokens = [
  CloudToken,
  AlgoliaToken,
  GoogleToken,
  AwsToken,
  ElasticsearchToken,
  AzureToken,
  StorageToken,
  ReadFileToken,
  DeleteFileToken,
  GetFileInfoToken,
  ListDirectoryToken,
  S3Token,
  SignUrlToken,
  UploadFileToken,
  OpenSearchToken,
  DocumentToken,
  QueryToken,
  RequestToken,
];

export function mapTokenToType(token) {
  switch (token) {
    case CloudToken.name:
    case AlgoliaToken.name:
    case GoogleToken.name:
    case AwsToken.name:
    case ElasticsearchToken.name:
    case AzureToken.name:
    case StorageToken.name:
    case S3Token.name:
    case OpenSearchToken.name:
    case ReadFileToken.name:
    case DeleteFileToken.name:
    case GetFileInfoToken.name:
    case ListDirectoryToken.name:
    case SignUrlToken.name:
    case UploadFileToken.name:
    case DocumentToken.name:
    case QueryToken.name:
    case RequestToken.name:
      return "function";
    default:
      return null;
  }
}
