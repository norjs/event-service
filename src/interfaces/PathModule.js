/**
 *
 * @type {typeof TypeUtils}
 */
const TypeUtils = require("@norjs/utils/Type");

/**
 * Subset of NodeJS 'path' module.
 *
 * @interface
 */
class PathModule {

    /**
     *
     * @param path {string}
     * @returns {string}
     */
    dirname (path) {}

}

TypeUtils.defineType("PathModule", TypeUtils.classToObjectPropertyTypes(PathModule),
    {
        acceptUndefinedProperties: true
    });

/**
 *
 * @type {typeof PathModule}
 */
module.exports = PathModule;
