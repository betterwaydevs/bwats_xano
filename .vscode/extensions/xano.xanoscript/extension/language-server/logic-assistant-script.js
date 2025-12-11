import { onCheckError } from "./onCheckError/onCheckError.js";

function checkError(text, objectType) {
  return onCheckError(text, objectType);
}
window.xsLanguageServer = {
  checkError,
};