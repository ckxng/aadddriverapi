# Driver API

Driver API is an Azure Function App

# Live Demo

- https://aadd.azure-api.net/1/ping
- https://aadd.azure-api.net/1/version
- https://aadd.azure-api.net/1/driver?base=dfw
- https://aadd.azure-api.net/1/driver?base=dfw&limit=1
- https://aadd.azure-api.net/1/driver?base=dfw&id=4d8d4ca7-9ae5-449c-a0a8-f3fc851449a1

# Development

This package can be uploaded to Azure as a ZIP deployment.  The conveniant
way to do this is to install Visual Studio Code and install the Azure 
Functions extension.  Download and open this project folder in Visual 
Studio Code.  A Local Project (driverapi) will appear in the Azure 
Functions extension.  With this Local Project selected, choose Deploy 
to Function App and follow the prompts.

# /api/driver

A Storage Account is required containing tables with the following schema:

## drivers

- PartitionKey {string} a code that is unique per base
- RowKey {string, guid} a unique key per driver
- FirstName {string}
- LastName {string}

## cars

- PartitionKey {string} a code that is unique per base
- RowKey {string, guid} a unique key per car
- OwnerKey {string, guid} the unique key of a row in the drivers table
- Make {string}
- Model {string}
- Year {string}
- Color {string}
- Plate {string}

## Partitions

A unique string representing the base is used as the PartitionKey.  In Azure
Storage Tables, partitions allow for [application scaling](https://docs.microsoft.com/en-us/rest/api/storageservices/designing-a-scalable-partitioning-strategy-for-azure-table-storage).
Therefore, a base must be specified for every query that searches for or interacts 
with drivers.  It is not possible to generate a list of all drivers, unless a
user submits a query for each base.

## Environment Variables

The Azure App Service hosting this Function App must contain the following
in Application Settings, so that the function can retrieve storage credentials via.
environment variables.  If a local execution environment is used (F5 in VS Code), 
this is provided in local.settings.json.

- both of AZURE_STORAGE_ACCOUNT and AZURE_STORAGE_ACCESS_KEY
- or AZURE_STORAGE_CONNECTION_STRING
    
# Author

- [Cameron King](http://cameronking.me)
- Ben Spellmann

# License

This software is released under the ISC license.

See `LICENSE` file for details.
