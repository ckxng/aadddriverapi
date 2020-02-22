'use strict';

/**
 * Returns an object representing the api major version.
 * 
 * /api/version
 */
module.exports = async function (context, req) {
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            version: 1
        }
    };
};
