import { UI_COPY } from "./copy.js";

export function renderCopy(template, params) {
  if (typeof template !== "string") {
    return template;
  }
  if (!params || typeof params !== "object") {
    return template;
  }

  return template.replace(/\{([^}]+)\}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];
      return value === undefined || value === null ? "" : String(value);
    }
    return match;
  });
}

export function getCopy(path) {
  if (Array.isArray(path)) {
    return _getByKeys(path);
  }
  if (typeof path === "string") {
    const trimmed = path.trim();
    if (!trimmed) return undefined;
    return _getByKeys(trimmed.split("/").map((x) => x.trim()).filter(Boolean));
  }
  return undefined;
}

function _getByKeys(keys) {
  let node = UI_COPY;
  for (const key of keys) {
    if (node && typeof node === "object" && Object.prototype.hasOwnProperty.call(node, key)) {
      node = node[key];
    } else {
      return undefined;
    }
  }
  return node;
}

