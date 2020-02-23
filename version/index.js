'use strict';

/**
 * Returns an object representing the api major version.
 * 
 * /api/version
 */
module.exports = async function (context, req) {
    return {
        body: {
            version: 1
        }
    };
};
