const _ = require('lodash');

/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require("@norjs/utils/Type");

/**
 * Subset of NodeJS HTTP server module.
 *
 * @interface
 */
class HttpServerModule {

    /**
     *
     * @param options {{IncomingMessage, ServerResponse}} Classes to be used for requests. Defaults to `IncomingMessage` and `ServerResponse`.
     * @param requestListener {function} If specified, will be added to the `request` event.
     * @returns {HttpServerObject}
     */
    createServer (options=undefined, requestListener=undefined) {}

}

TypeUtils.defineType(
    "HttpServerModule",
    TypeUtils.classToObjectPropertyTypes(HttpServerModule),
    {
        acceptUndefinedProperties: true
    }
);

/**
 *
 * @type {typeof HttpServerModule}
 */
module.exports = HttpServerModule;
