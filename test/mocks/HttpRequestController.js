/**
 * @implements {HttpRequestController}
 */
class HttpRequestControllerMock {

    getParams() {
        return undefined;
    }

    getRequestData() {
        return undefined;
    }

    handleRequestErrors(err) {
        return undefined;
    }

    onRequest() {
        return undefined;
    }

}

/**
 *
 * @type {HttpRequestController}
 */
module.exports = HttpRequestControllerMock;
