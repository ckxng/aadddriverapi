'use strict';

/**
 * Returns the string "pong" if the API is alive.
 * 
 * /api/ping
 */
module.exports = async function (context, req) {
    return {
        // status: 200, /* Defaults to 200 */
        body: "pong"
    };
};
