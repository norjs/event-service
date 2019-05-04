/**
 * @implements {SocketHttpServer}
 */
class SocketHttpServerMock {

    close() {
    }

    createRequestController(request, response) {
        return undefined;
    }

    getClass() {
        return undefined;
    }

    start() {
    }

}

/**
 *
 * @type {SocketHttpServer}
 */
module.exports = SocketHttpServerMock;
