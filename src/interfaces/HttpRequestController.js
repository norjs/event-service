/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require("@norjs/utils/Type");

/**
 * @interface
 */
class HttpRequestController {

    /**
     * Get request query parameters.
     *
     * @returns {{}}
     * @protected
     */
    getParams () {}

    // noinspection JSUnusedGlobalSymbols
    /**
     * Get request body data.
     *
     * @return {Promise.<*>} The request input data
     * @protected
     */
    getRequestData () {}

    /**
     *
     * @param err {Error}
     * @return {*}
     */
    handleRequestErrors (err) {}

    /**
     * HTTP service will call this method to handle the request.
     * @return {*} The JSON data which was sent.
     */
    onRequest () {}

}

TypeUtils.defineType(
    "HttpRequestController",
    TypeUtils.classToObjectPropertyTypes(HttpRequestController),
    {
        acceptUndefinedProperties: true
    }
);

/**
 *
 * @type {typeof HttpRequestController}
 */
module.exports = HttpRequestController;
