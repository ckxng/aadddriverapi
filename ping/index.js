'use strict';

/**
 * Generate a diceware passphrase.
 * 
 * /api/generate?length={number}&seq={string}
 */
module.exports = async function (context, req) {
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: "pong"
    };
};
