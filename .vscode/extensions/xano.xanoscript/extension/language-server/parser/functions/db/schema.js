export const addonSchema = {
  name: "[string]",
  "input?": { "[string]": "[expression]" },
  "as?": "[string]",
  "output?": ["[string]"],
};
// allow for sub addons
addonSchema["addon?"] = [addonSchema];
