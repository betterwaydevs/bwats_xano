import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// security
export const SecurityToken = createTokenByName("security", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// check_password
export const CheckPasswordToken = createTokenByName("check_password", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// create_password
export const CreatePasswordToken = createTokenByName("create_password", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// create_uuid
export const CreateUuidToken = createTokenByName("create_uuid", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// create_auth
export const CreateAuthTokenToken = createTokenByName("create_auth_token", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// create_curve_key
export const CreateCurveKeyToken = createTokenByName("create_curve_key", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// create_rsa_key
export const CreateRsaKeyToken = createTokenByName("create_rsa_key", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// create_secret_key
export const CreateSecretKeyToken = createTokenByName("create_secret_key", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// decrypt
export const DecryptToken = createTokenByName("decrypt", {
  llt: Identifier,
  categories: [Identifier],
});

// encrypt
export const EncryptToken = createTokenByName("encrypt", {
  llt: Identifier,
  categories: [Identifier],
});

// generate_pass
export const GeneratePassToken = createTokenByName("generate_pass", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// generate_uuid
export const GenerateUuidToken = createTokenByName("generate_uuid", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// jwe_decode
export const JweDecodeToken = createTokenByName("jwe_decode", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// jwe_encode
export const JweEncodeToken = createTokenByName("jwe_encode", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// jws_decode
export const JwsDecodeToken = createTokenByName("jws_decode", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// jws_encode
export const JwsEncodeToken = createTokenByName("jws_encode", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// random_bytes
export const RandomBytesToken = createTokenByName("random_bytes", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// random_number
export const RandomNumberToken = createTokenByName("random_number", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const SecurityTokens = [
  CheckPasswordToken,
  CreatePasswordToken,
  CreateUuidToken,
  CreateAuthTokenToken,
  CreateCurveKeyToken,
  CreateRsaKeyToken,
  CreateSecretKeyToken,
  DecryptToken,
  EncryptToken,
  GeneratePassToken,
  GenerateUuidToken,
  JweDecodeToken,
  JweEncodeToken,
  JwsDecodeToken,
  JwsEncodeToken,
  RandomBytesToken,
  RandomNumberToken,
  SecurityToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case SecurityToken.name:
    case CheckPasswordToken.name:
    case CreatePasswordToken.name:
    case CreateUuidToken.name:
    case CreateAuthTokenToken.name:
    case CreateCurveKeyToken.name:
    case CreateRsaKeyToken.name:
    case CreateSecretKeyToken.name:
    case DecryptToken.name:
    case EncryptToken.name:
    case GeneratePassToken.name:
    case GenerateUuidToken.name:
    case JweDecodeToken.name:
    case JweEncodeToken.name:
    case JwsDecodeToken.name:
    case JwsEncodeToken.name:
    case RandomBytesToken.name:
    case RandomNumberToken.name:
      return "function";
    default:
      return null;
  }
}
