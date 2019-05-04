/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require("@norjs/utils/Type");

/**
 * @interface
 */
class SocketHttpServer {

    /**
     *
     * @returns {typeof AbstractSocketHttpServer}
     */
    getClass () {}

    // noinspection JSUnusedGlobalSymbols
    /**
     *
     * @returns {string}
     */
    static getTimeForLog () {}

    // noinspection JSUnusedGlobalSymbols
    /**
     *
     * @returns {string}
     */
    static getAppName () {}

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns a request controller for this request.
     *
     * @param request {HttpRequestObject}
     * @param response {HttpResponseObject}
     * @returns {HttpRequestController}
     */
    createRequestController (request, response) {}

    /**
     * Start the service
     */
    start () {}

    /**
     * Close the service
     */
    close () {}

}

TypeUtils.defineType(
    "SocketHttpServer",
    TypeUtils.classToObjectPropertyTypes(SocketHttpServer),
    {
        acceptUndefinedProperties: true
    }
);

/**
 *
 * @type {typeof SocketHttpServer}
 */
module.exports = SocketHttpServer;
