// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

'use strict';

//TODO: Fix this reference to refer the layers. 
const logManager = require('log-manager.js');

const helper = require('/opt/nodejs/helper.js');
const doc = require('dynamodb-doc');
const dynamodb = new doc.DynamoDB();

const tableName = "Product";
const tableDefinition = {
    AttributeDefinitions: [ 
    {
      AttributeName: "ProductId", 
      AttributeType: "S"
    } ], 
    KeySchema: [ 
    {
      AttributeName: "ProductId", 
      KeyType: "HASH"
    } ], 
    ProvisionedThroughput: {
     ReadCapacityUnits: 5, 
     WriteCapacityUnits: 5
    }, 
    TableName: tableName
};

// Get a product from DynamoDB
module.exports.getProduct = function(event, callback) {
    logManager.log(event, "ProductManager", { "Message": "DAL GetProduct() called.", "ProductId" : event.pathParameters.resourceId});

    var params = {
        "TableName": tableName,
        "Key": {
            ProductId: event.pathParameters.resourceId
        }
    };

    dynamodb.getItem(params, (err, data) => {
        var response;
        if (err)
            response = createResponse(500, err);
        else
            response = createResponse(200, data.Item ? data.Item.doc : null);

        callback(response);
    });
    
};

// Add or update a product to DynamoDB
module.exports.updateProduct = (event, callback) => {
    logManager.log(event, "ProductManager", {"Message": "DAL UpdateProduct() called.", "ProductId" : event.pathParameters.resourceId});

    helper.createTable(tableDefinition, function() {
        var item = {
            "ProductId": event.pathParameters.resourceId,
            "doc": event.body
        };

        var params = {
            "TableName": tableName,
            "Item": item
        };
        
        dynamodb.putItem(params, (err) => {
            var response;
            if (err)
                response = createResponse(500, err);
            else
                response = createResponse(200, null);
            
            callback(response);
        });        
    });
};

// delete a product from DynamoDB
module.exports.deleteProduct = (event, callback) => {
    logManager.log(event, "ProductManager", {"Message": "DAL deleteProduct() called.", "ProductId" : event.pathParameters.resourceId});

    var params = {
        "TableName": tableName,
        "Key": {
            "ProductId": event.pathParameters.resourceId
        }
    };

    dynamodb.deleteItem(params, (err) => {
        var response;
        if (err)
            response = createResponse(500, err);
        else
            response = createResponse(200, null);

        callback(response);
    });
};

const createResponse = (statusCode, body) => {
    return {
        "statusCode": statusCode,
        "body": body || ""
    }
};