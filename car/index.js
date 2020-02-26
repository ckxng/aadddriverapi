'use strict';

// Either:
// - both of AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY
// - or AZURE_STORAGE_CONNECTION_STRING
// must be provided in order for createTableService to connect.
var azure = require('azure-storage');
var tableService = azure.createTableService();

/**
 * Gets a car
 * 
 * /api/car?base=<code>
 * /api/car?base=<code>&limit=<number>
 * /api/car?base=<code>&driver=<guid>
 * /api/car?base=<code>&driver=<guid>&limit=<number>
 * /api/car?base=<code>&id=<guid>
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
 * Looks up a car
 * 
 * @param {context} context 
 * @param {req} req 
 */
async function get(context, req) {
    if(!req.query.base) {
        console.log("get car base is required");
        return {
            status: 403,
            body: "base is required"
        }; // do not continue if params are missing
    }

    // look up a single car
    if(req.query.id) {
        return getById(context, req);
    }

    // return a list of cars at this base
    // optionally filtered by driver
    return getListByBase(context, req);
}

/**
 * Return a single car by base and id

 * @param {context} context 
 * @param {req} req 
 */
async function getById(context, req) {
    var query = new Promise(function(resolve, reject) {
        tableService.retrieveEntity('cars', req.query.base, req.query.id, function(err, result, response) {
            console.log("get cars with description "+req.query.base+" "+req.query.id);
            if(err) {
                console.log("get cars error "+JSON.stringify("err"));
                if(err.statusCode == 404) {
                    resolve({
                        status: 404,
                        body: "car not found" // more friendly message if a driver simply isn't found
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
                console.log("get cars found "+JSON.stringify(result));
                resolve({
                    body: JSON.stringify({
                        base: result.PartitionKey._,
                        id: result.RowKey._,
                        driver: result.OwnerKey._,
                        Make: result.Make._,
                        Model: result.Model._,
                        Year: result.Year._,
                        Color: result.Color._,
                        Plate: result.Plate._
                    })
                });
            }
        });
    });

    return await query;
}

/**
 * Return a list of cars by base, optionally filtered by driver

 * @param {context} context 
 * @param {req} req 
 */
async function getListByBase(context, req) {
    var query = new Promise(function(resolve, reject) {
        // build search query
        var searchquery = new azure.TableQuery();
        if(req.query.driver) {
            searchquery.where('PartitionKey eq ? and OwnerKey eq ?', req.query.base, req.query.driver);
        } else {
            searchquery.where('PartitionKey eq ?', req.query.base)
        }
        if(req.query.limit) {
            searchquery = searchquery.top(req.query.limit);
        }

        tableService.queryEntities('cars', searchquery, null, function(err, result) {
            console.log("get cars with description "+req.query.base+" "+req.query.id);
            if(err) {
                console.log("get cars error "+JSON.stringify("err"));
                if(err.statusCode == 404) {
                    resolve({
                        status: 404,
                        body: "car not found" // more friendly message if a driver simply isn't found
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
                console.log("get cars found "+JSON.stringify(result));
                resolve({
                    body: JSON.stringify(result.entries.map(function(v) {
                        return {
                            base: v.PartitionKey._,
                            id: v.RowKey._,
                            driver: v.OwnerKey._,
                            Make: v.Make._,
                            Model: v.Model._,
                            Year: v.Year._,
                            Color: v.Color._,
                            Plate: v.Plate._
                        };
                    }))
                });
            }
        });
    });

    return await query;
}
