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
 * /api/driver?base=<code>&driver=<guid>
 */
module.exports = async function (context, req) {
    if(req.query.base && req.query.driver) {
        tableService.retrieveEntity('drivers', req.query.base, req.query.driver, function(err, result, res) {
            if(err) {
                context.res = {
                    status: 500,
                    body: err
                }
            } else {
                if(result) {
                    context.res = {
                        body: result
                    }
                } else {
                    context.res = {
                        status: 404,
                        body: "driver not found"
                    }
                }
            }
        });
    } else {
        context.res = {
            status: 403,
            body: "missing parameter"
        };
    }
};
