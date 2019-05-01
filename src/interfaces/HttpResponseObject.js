/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require("@norjs/utils/Type");

/**
 * This interface describes a subset of the API in NodeJS `http.ServerResponse`.
 *
 * @see https://nodejs.org/api/http.html#http_class_http_serverresponse
 * @interface
 */
class HttpResponseObject {

    /**
     * @returns {number}
     */
    get statusCode () {}

    /**
     * @param value {number}
     */
    set statusCode (value) {}

    /**
     *
     * @param name {string}
     * @param value {*}
     */
    setHeader (name, value) {}

    /**
     *
     * @param chunk {string|Buffer}
     * @param encoding {string}
     * @param callback {Function}
     */
    write (chunk, encoding = "utf8", callback=undefined) {}

    /**
     *
     */
    end () {}

}

TypeUtils.defineType("HttpResponseObject", TypeUtils.classToObjectPropertyTypes(HttpResponseObject));

/**
 *
 * @type {typeof HttpResponseObject}
 */
module.exports = HttpResponseObject;
