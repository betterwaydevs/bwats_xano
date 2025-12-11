import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// zip
export const ZipToken = createTokenByName("zip", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// add_to_archive
export const AddToArchiveToken = createTokenByName("add_to_archive", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// create_archive
export const CreateArchiveToken = createTokenByName("create_archive", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// delete_from_archive
export const DeleteFromArchiveToken = createTokenByName("delete_from_archive", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// extract
export const ExtractToken = createTokenByName("extract", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// view_archive
export const ViewContentsToken = createTokenByName("view_contents", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ZipTokens = [
  ZipToken,
  AddToArchiveToken,
  CreateArchiveToken,
  DeleteFromArchiveToken,
  ExtractToken,
  ViewContentsToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case ZipToken.name:
    case AddToArchiveToken.name:
    case CreateArchiveToken.name:
    case DeleteFromArchiveToken.name:
    case ExtractToken.name:
    case ViewContentsToken.name:
      return "function";
  }
}
