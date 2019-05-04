
/**
 * @implements {FileSystemModule}
 */
class FileSystemModuleMock {

    chmodSync(path, mode) {}

    existsSync(path) {
        return false;
    }

    mkdirSync(path, options) {}

    statSync(path, options) {
        return undefined;
    }

    unlinkSync(path) {}
}

/**
 *
 * @type {FileSystemModule}
 */
module.exports = FileSystemModuleMock;
