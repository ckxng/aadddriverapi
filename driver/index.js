'use strict';

// Either:
// - both of AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY
// - or AZURE_STORAGE_CONNECTION_STRING
// must be provided in order for createTableService to connect.
var azure = require('azure-storage');
var tableService = azure.createTableService();

/**
 * Gets a driver
 * 
 * /api/driver?base=<code>&id=<guid>
 */
module.exports = async function (context, req) {
    console.log("request "+JSON.stringify(req))
    if(req.method == "GET") {
        return get(context, req);
    }

    return {
        status: 403,
        body: "not implemented"
    };
};

/**
 * Looks up a driver
 * 
 * @param {context} context 
 * @param {req} req 
 */
async function get(context, req) {
    if(!req.query.base || !req.query.id) {
        console.log("get driver base and id are both required");
        return {
            status: 403,
            body: "base and id are both required"
        }; // do not continue if params are missing
    }

    var query = new Promise(function(resolve, reject) {
        tableService.retrieveEntity('drivers', req.query.base, req.query.id, function(err, result, response) {
            console.log("get driver with description "+req.query.base+" "+req.query.id);
            if(err) {
                console.log("get driver error "+JSON.stringify("err"));
                if(err.statusCode == 404) {
                    resolve({
                        status: 404,
                        body: "driver not found" // more friendly message if a driver simply isn't found
                    });
                } else {
                    resolve({
                        status: err.statusCode,
                        body: {
                            err: err.message // mode detailed message if there was another error
                        }
                    });
                }
            } else { // no error
                console.log("get driver found "+JSON.stringify(result));
                resolve({
                    body: JSON.stringify({
                        base: result.PartitionKey._,
                        id: result.RowKey._,
                        FirstName: result.FirstName._,
                        LastName: result.LastName._
                    })
                });
            }
        });
    });

    return await query;
}