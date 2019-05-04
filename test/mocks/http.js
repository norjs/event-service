/**
 * @implements {HttpClientModule}
 */
class HttpModuleMock {

    request(options, callback) {
        return undefined;
    }

}

/**
 *
 * @type {HttpClientModule}
 */
module.exports = HttpModuleMock;
