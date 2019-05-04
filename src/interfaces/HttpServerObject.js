/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require("@norjs/utils/Type");

/**
 * Subset of NodeJS HTTP server instance in use by us.
 *
 * @interface
 */
class HttpServerObject {

    close () {}

}

TypeUtils.defineType("HttpServerObject", TypeUtils.classToObjectPropertyTypes(HttpServerObject));

/**
 *
 * @type {typeof HttpServerObject}
 */
module.exports = HttpServerObject;
