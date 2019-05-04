require('./FileSystemStatsObject.js');

/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require("@norjs/utils/Type");

/**
 * Subset of NodeJS fs module.
 *
 * @interface
 */
class FileSystemModule {

    /**
     *
     * @param path {string}
     * @returns {boolean}
     */
    existsSync (path) {}

    /**
     *
     * @param path {string}
     * @param options {{recursive:boolean, mode:number}}
     */
    mkdirSync (path, options = {recursive: false, mode: 0o777}) {}

    /**
     *
     * @param path {string}
     * @param options {{bigint: boolean}} If `true`, numeric values should be returned as `bigint`
     * @returns {FileSystemStatsObject}
     */
    statSync (path, options = {bigint: false}) {}

    /**
     *
     * @param path {string}
     */
    unlinkSync (path) {}

    /**
     *
     * @param path {string}
     * @param mode {number}
     */
    chmodSync (path, mode) {}

}

TypeUtils.defineType(
    "FileSystemModule",
    TypeUtils.classToObjectPropertyTypes(FileSystemModule),
    {
        acceptUndefinedProperties: true
    }
);

/**
 *
 * @type {typeof FileSystemModule}
 */
module.exports = FileSystemModule;
