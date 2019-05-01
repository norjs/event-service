require('../interfaces/HttpRequestObject.js');
require('../interfaces/HttpResponseObject.js');

/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require("@norjs/utils/Type");

/**
 *
 * @type {typeof LogicUtils}
 */
const LogicUtils = require('@norjs/utils/Logic');

/**
 *
 * @type {typeof SocketHttpServer}
 */
const SocketHttpServer = require('../abstracts/SocketHttpServer.js');

/**
 * This class implements a HTTP server over UNIX socket file for NorJS EventService.
 */
class EventServiceSocketHttpServer extends SocketHttpServer {

    /**
     *
     * @param listen {string} The UNIX socket file to listen for requests.
     * @param http {module:http} The Node.js HTTP module
     * @param controller {EventServiceController}
     * @param RequestController {typeof EventServiceHttpRequestController}
     */
    constructor ({controller, RequestController, listen, http}) {

        super({listen, http});

        TypeUtils.assert(controller, "EventServiceController");
        TypeUtils.assert(RequestController, "function");
        // TypeUtils.assert(RequestController, "typeof EventServiceHttpRequestController");

        /**
         *
         * @member {EventServiceController}
         * @protected
         */
        this._controller = controller;

        /**
         *
         * @member {EventServiceHttpRequestController}
         * @protected
         */
        this._RequestController = RequestController;

    }

    /**
     *
     * @returns {string}
     */
    static getAppName () {
        return '@norjs/event-service';
    }

    /**
     *
     * @param request {HttpRequestObject}
     * @param response {HttpResponseObject}
     * @returns {EventServiceHttpRequestController}
     */
    createRequestController (request, response) {
        TypeUtils.assert(request, "HttpRequestObject");
        TypeUtils.assert(response, "HttpResponseObject");
        return new this._RequestController({
            request,
            response,
            controller: this._controller
        });
    }

}

TypeUtils.defineType("EventServiceSocketHttpServer", TypeUtils.classToTestType(EventServiceSocketHttpServer));

/**
 *
 * @type {typeof EventServiceSocketHttpServer}
 */
module.exports = EventServiceSocketHttpServer;
