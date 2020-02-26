'use strict';

// Either:
// - both of AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY
// - or AZURE_STORAGE_CONNECTION_STRING
// must be provided in order for createTableService to connect.
var azure = require('azure-storage');
var tableService = azure.createTableService();

/**
 * Gets a rider
 * 
 * /api/rider?base=<code>
 * /api/rider?base=<code>&limit=<number>
 * /api/rider?base=<code>&id=<guid>
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
 * Looks up a rider
 * 
 * @param {context} context 
 * @param {req} req 
 */
async function get(context, req) {
    if(!req.query.base) {
        console.log("get rider base is required");
        return {
            status: 403,
            body: "base is required"
        }; // do not continue if params are missing
    }

    // look up a single rider
    if(req.query.id) {
        return getById(context, req);
    }

    // return a list of riders at this base
    return getListByBase(context, req);
}

/**
 * Return a single rider by base and id

 * @param {context} context 
 * @param {req} req 
 */
async function getById(context, req) {
    var query = new Promise(function(resolve, reject) {
        tableService.retrieveEntity('riders', req.query.base, req.query.id, function(err, result, response) {
            console.log("get rider with description "+req.query.base+" "+req.query.id);
            if(err) {
                console.log("get rider error "+JSON.stringify("err"));
                if(err.statusCode == 404) {
                    resolve({
                        status: 404,
                        body: "rider not found" // more friendly message if a rider simply isn't found
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
                console.log("get rider found "+JSON.stringify(result));
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

/**
 * Return a list of riders by base

 * @param {context} context 
 * @param {req} req 
 */
async function getListByBase(context, req) {
    var query = new Promise(function(resolve, reject) {
        // build search query
        var searchquery = new azure.TableQuery().where('PartitionKey eq ?', req.query.base);
        if(req.query.limit) {
            searchquery = searchquery.top(req.query.limit);
        }

        tableService.queryEntities('riders', searchquery, null, function(err, result) {
            console.log("get rider with description "+req.query.base+" "+req.query.id);
            if(err) {
                console.log("get rider error "+JSON.stringify("err"));
                if(err.statusCode == 404) {
                    resolve({
                        status: 404,
                        body: "riders not found" // more friendly message if a rider simply isn't found
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
                console.log("get rider found "+JSON.stringify(result));
                resolve({
                    body: JSON.stringify(result.entries.map(function(v) {
                        return {
                            base: v.PartitionKey._,
                            id: v.RowKey._,
                            FirstName: v.FirstName._,
                            LastName: v.LastName._
                        };
                    }))
                });
            }
        });
    });

    return await query;
}