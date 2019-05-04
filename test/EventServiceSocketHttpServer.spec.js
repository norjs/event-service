const assert = require('assert');

/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require('@norjs/utils/Type');

const FS = require('./mocks/fs.js');
const HTTP = require('./mocks/http.js');
const PATH = require('./mocks/path.js');
const EventServiceController = require('./mocks/EventServiceController.js');
const HttpRequestController = require('./mocks/HttpRequestController.js');

/**
 *
 * @type {typeof EventServiceSocketHttpServer}
 */
const EventServiceSocketHttpServer = require('../src/service/EventServiceSocketHttpServer.js');

describe('EventServiceSocketHttpServer', () => {

    describe('#getAppName', () => {
        it('returns the name', () => {
            assert( EventServiceSocketHttpServer.getAppName(), "nor-event-service" );
        });
    });

    describe('instance', () => {

        let controller;
        let listen = "test.sock";
        let server;

        beforeEach( () => {

            controller = new EventServiceController();

            server = new EventServiceSocketHttpServer({
                controller,
                RequestController: HttpRequestController,
                listen,
                httpModule: HTTP,
                pathModule: PATH,
                fsModule: FS
            });

        });

        afterEach( () => {
            controller = undefined;
            server = undefined;
        });

        describe('createRequestController', () => {

            const request = {};

            const response = {};

            server.createRequestController(request, response);
        });

    });


});
