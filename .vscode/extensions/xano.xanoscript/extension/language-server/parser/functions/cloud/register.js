import { cloudAlgoliaFn } from "./cloudAlgoliaFn.js";
import { cloudAlgoliaRequestFn } from "./cloudAlgoliaRequestFn.js";
import { cloudAwsFn } from "./cloudAwsFn.js";
import { cloudAwsOpenSearchFn } from "./cloudAwsOpenSearchFn.js";
import { cloudAwsS3Fn } from "./cloudAwsS3Fn.js";
import { cloudAzureFn } from "./cloudAzureFn.js";
import { cloudDeleteFileFn } from "./cloudDeleteFileFn.js";
import { cloudElasticSearchFn } from "./cloudElasticSearchFn.js";
import { cloudGetFileInfoFn } from "./cloudGetFileInfoFn.js";
import { cloudGoogleFn } from "./cloudGoogleFn.js";
import { cloudListDirectoryFn } from "./cloudListDirectoryFn.js";
import { cloudReadFileFn } from "./cloudReadFileFn.js";
import { cloudSearchDocumentFn } from "./cloudSearchDocumentFn.js";
import { cloudSearchQueryFn } from "./cloudSearchQueryFn.js";
import { cloudSearchRequestFn } from "./cloudSearchRequestFn.js";
import { cloudSignUrlFn } from "./cloudSignUrlFn.js";
import { cloudStorageFn } from "./cloudStorageFn.js";
import { cloudUploadFileFn } from "./cloudUploadFileFn.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.cloudAlgoliaFn = $.RULE("cloudAlgoliaFn", cloudAlgoliaFn($));
  $.cloudAlgoliaRequestFn = $.RULE(
    "cloudAlgoliaRequestFn",
    cloudAlgoliaRequestFn($)
  );
  $.cloudAwsFn = $.RULE("cloudAwsFn", cloudAwsFn($));
  $.cloudAwsOpenSearchFn = $.RULE(
    "cloudAwsOpenSearchFn",
    cloudAwsOpenSearchFn($)
  );
  $.cloudAwsS3Fn = $.RULE("cloudAwsS3Fn", cloudAwsS3Fn($));
  $.cloudAzureFn = $.RULE("cloudAzureFn", cloudAzureFn($));
  $.cloudDeleteFileFn = $.RULE("cloudDeleteFileFn", cloudDeleteFileFn($));
  $.cloudElasticSearchFn = $.RULE(
    "cloudElasticSearchFn",
    cloudElasticSearchFn($)
  );
  $.cloudGetFileInfoFn = $.RULE("cloudGetFileInfoFn", cloudGetFileInfoFn($));
  $.cloudGoogleFn = $.RULE("cloudGoogleFn", cloudGoogleFn($));
  $.cloudListDirectoryFn = $.RULE(
    "cloudListDirectoryFn",
    cloudListDirectoryFn($)
  );
  $.cloudReadFileFn = $.RULE("cloudReadFileFn", cloudReadFileFn($));
  $.cloudSearchDocumentFn = $.RULE(
    "cloudSearchDocumentFn",
    cloudSearchDocumentFn($)
  );
  $.cloudSearchQueryFn = $.RULE("cloudSearchQueryFn", cloudSearchQueryFn($));
  $.cloudSearchRequestFn = $.RULE(
    "cloudSearchRequestFn",
    cloudSearchRequestFn($)
  );
  $.cloudSignUrlFn = $.RULE("cloudSignUrlFn", cloudSignUrlFn($));
  $.cloudStorageFn = $.RULE("cloudStorageFn", cloudStorageFn($));
  $.cloudUploadFileFn = $.RULE("cloudUploadFileFn", cloudUploadFileFn($));
};
