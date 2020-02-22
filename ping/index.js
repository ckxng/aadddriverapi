'use strict';

/**
 * Returns the string "pong" if the API is alive.
 * 
 * /api/ping
 */
module.exports = async function (context, req) {
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: "pong"
    };
};
