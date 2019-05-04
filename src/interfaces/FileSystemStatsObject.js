/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require("@norjs/utils/Type");

/**
 * Subset of NodeJS File System stats object in use by us.
 *
 * @interface
 */
class FileSystemStatsObject {

    /**
     * @returns {boolean}
     */
    isSocket () {}

}

TypeUtils.defineType(
    "FileSystemStatsObject",
    TypeUtils.classToObjectPropertyTypes(FileSystemStatsObject),
    {
        acceptUndefinedProperties: true
    }
);

/**
 *
 * @type {typeof FileSystemStatsObject}
 */
module.exports = FileSystemStatsObject;
