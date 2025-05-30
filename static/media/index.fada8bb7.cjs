var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  decycle: () => decycle,
  extend: () => extend,
  retrocycle: () => retrocycle
});
module.exports = __toCommonJS(index_exports);
var isObject = (value) => typeof value === "object" && value != null && !(value instanceof Boolean) && !(value instanceof Date) && !(value instanceof Number) && !(value instanceof RegExp) && !(value instanceof String);
var toPointer = (parts) => "#" + parts.map((part) => String(part).replace(/~/g, "~0").replace(/\//g, "~1")).join("/");
var decycle = () => {
  const paths = /* @__PURE__ */ new WeakMap();
  return function replacer(key, value) {
    if (key !== "$ref" && isObject(value)) {
      const seen = paths.has(value);
      if (seen) {
        return { $ref: toPointer(paths.get(value)) };
      } else {
        paths.set(value, [...paths.get(this) ?? [], key]);
      }
    }
    return value;
  };
};
function retrocycle() {
  const parents = /* @__PURE__ */ new WeakMap();
  const keys = /* @__PURE__ */ new WeakMap();
  const refs = /* @__PURE__ */ new Set();
  function dereference(ref) {
    const parts = ref.$ref.slice(1).split("/");
    let key, parent, value = this;
    for (var i = 0; i < parts.length; i++) {
      key = parts[i].replace(/~1/g, "/").replace(/~0/g, "~");
      value = value[key];
    }
    parent = parents.get(ref);
    parent[keys.get(ref)] = value;
  }
  return function reviver(key, value) {
    if (key === "$ref") {
      refs.add(this);
    } else if (isObject(value)) {
      var isRoot = key === "" && Object.keys(this).length === 1;
      if (isRoot) {
        refs.forEach(dereference, this);
      } else {
        parents.set(value, this);
        keys.set(value, key);
      }
    }
    return value;
  };
}
var extend = (JSON) => {
  return Object.defineProperties(JSON, {
    decycle: {
      value: (object, space) => JSON.stringify(object, decycle(), space)
    },
    retrocycle: {
      value: (s) => JSON.parse(s, retrocycle())
    }
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  decycle,
  extend,
  retrocycle
});
//# sourceMappingURL=index.cjs.map