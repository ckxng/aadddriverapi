# Driver API

Driver API is an Azure Function App

# Live Demo

- https://aadd.azure-api.net/1/ping
- https://aadd.azure-api.net/1/version

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
