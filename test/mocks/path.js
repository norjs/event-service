/**
 * @implements {PathModule}
 */
class PathModuleMock {

    dirname(path) {
        return "";
    }
}

/**
 *
 * @type {PathModule}
 */
module.exports = PathModuleMock;
