'use strict';

/**
 * Returns the api major version.
 * 
 * /api/version
 */
module.exports = async function (context, req) {
    return {
        body: "1"
    };
};
