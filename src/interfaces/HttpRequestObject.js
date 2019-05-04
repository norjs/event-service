/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require("@norjs/utils/Type");

/**
 * @interface
 */
class HttpRequestObject {

    /**
     * @returns {string}
     */
    get url () {}

    /**
     *
     * @param eventName {string|Symbol}
     * @param listener {Function}
     * @returns {HttpRequestObject}
     */
    on (eventName, listener) {}

}

TypeUtils.defineType(
    "HttpRequestObject",
    TypeUtils.classToObjectPropertyTypes(HttpRequestObject),
    {
        acceptUndefinedProperties: true
    }
);

/**
 *
 * @type {typeof HttpRequestObject}
 */
module.exports = HttpRequestObject;
