import {
  AttachmentToken,
  AudioToken,
  BoolToken,
  DateToken,
  DecimalToken,
  EmailToken,
  FileToken,
  GeoLinestringToken,
  GeoMultilinestringToken,
  GeoMultipointToken,
  GeoMultipolygonToken,
  GeoPointToken,
  GeoPolygonToken,
  ImageToken,
  IntToken,
  JsonToken,
  PasswordToken,
  TextToken,
  TimestampToken,
  UuidToken,
  VectorToken,
  VideoToken,
} from "../../lexer/columns.js";
import { Question } from "../../lexer/control.js";
import { Identifier } from "../../lexer/identifier.js";
import { getVarName } from "../generic/utils.js";

const DEFAULT_CONFIG = {
  include_file: false,
  isTableSchema: false, // enforces that "id" column can only be int or uuid
};

/**
 * int id | timestamp created_at?=now
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function columnDefinition($) {
  /**
   * @param {typeof DEFAULT_CONFIG} [config]
   * @returns {void}
   */
  return (config = {}, schema = {}) => {
    config = { ...DEFAULT_CONFIG, ...config };

    let nullable = false;
    let iterable = false;
    let optional = false;

    $.sectionStack.push("columnDefinition");

    const inputTypeToken = $.OR([
      { ALT: () => $.CONSUME(IntToken) }, // column of type "int"
      { ALT: () => $.CONSUME(TimestampToken) }, // column of type "timestamp"
      { ALT: () => $.CONSUME(TextToken) }, // column of type "text"
      { ALT: () => $.CONSUME(UuidToken) }, // column of type "uuid"
      { ALT: () => $.CONSUME(VectorToken) }, // column of type "vector"
      { ALT: () => $.CONSUME(DateToken) }, // column of type "date"
      { ALT: () => $.CONSUME(BoolToken) }, // column of type "bool"
      { ALT: () => $.CONSUME(DecimalToken) }, // column of type "decimal"
      { ALT: () => $.CONSUME(EmailToken) }, // column of type "email"
      { ALT: () => $.CONSUME(PasswordToken) }, // column of type "password"
      { ALT: () => $.CONSUME(JsonToken) }, // column of type "json"
      { ALT: () => $.CONSUME(ImageToken) }, // column of type "image"
      { ALT: () => $.CONSUME(VideoToken) }, // column of type "video"
      { ALT: () => $.CONSUME(AudioToken) }, // column of type "audio"
      { ALT: () => $.CONSUME(AttachmentToken) }, // column of type "attachment"
      { ALT: () => $.CONSUME(GeoPointToken) }, // column of type "geo_point"
      { ALT: () => $.CONSUME(GeoMultipointToken) }, // column of type "geo_multipoint"
      { ALT: () => $.CONSUME(GeoLinestringToken) }, // column of type "geo_linestring"
      { ALT: () => $.CONSUME(GeoMultilinestringToken) }, // column of type "geo_multilinestring"
      { ALT: () => $.CONSUME(GeoPolygonToken) }, // column of type "geo_polygon"
      { ALT: () => $.CONSUME(GeoMultipolygonToken) }, // column of type "geo_multipolygon"
      { GATE: () => !!config.include_file, ALT: () => $.CONSUME(FileToken) }, // include another file
    ]);

    // is it an array ?
    $.OPTION1(() => {
      iterable = true;
      $.SUBRULE($.arraySlice);
    });

    // is it nullable ?
    $.OPTION2(() => {
      nullable = true;
      $.CONSUME(Question);
    });

    // Column name (e.g., "user_id", "optional_column", "required_column")
    const nameToken = $.CONSUME(Identifier);

    // ? (is it an optional field)
    $.OPTION6(() => {
      optional = true;
      $.CONSUME1(Question);
    });

    $.OPTION3(() => $.SUBRULE($.columnDefaultValueAttribute)); // Optional default value
    $.OPTION4(() => $.SUBRULE($.filterDefinition, { ARGS: [inputTypeToken] })); // Optional filter definition
    // $.OPTION5(() => $.SUBRULE($.columnMetadataDefinition));
    const captured = {};
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        nameToken,
        {
          "description?": "[string]",
          "table?": "[string]",
          "size?": "[number]",
          "sensitive?": "[boolean]",
        },
        captured,
      ],
    });

    if (inputTypeToken.image == "vector" && !captured.size) {
      $.addWarning(
        'Column named "vector" should have a size attribute defining its length.',
        nameToken
      );
    }

    // add variable to schema
    schema[getVarName(nameToken)] = {
      typeToken: inputTypeToken,
      nameToken: nameToken,
    };

    // add the variable to the registry
    $.addInput(
      nameToken.image,
      inputTypeToken.image,
      iterable,
      nullable,
      optional
    );

    $.sectionStack.pop();
  };
}
