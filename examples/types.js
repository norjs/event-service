const TypeUtils = require('@norjs/utils/Type');

/**
 * @typedef {Object} FooDTO
 * @property {number} id - My resource id
 * @property {string} name - My resource name
 */
TypeUtils.defineType(
    "FooDTO",
    {
        "id": "number",
        "name": "string"
    }
);
