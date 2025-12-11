import { createUniqToken } from "./utils.js";

export const Identifier = createUniqToken({
  name: "Identifier",
  pattern: /[a-zA-Z_]\w*/,
});
