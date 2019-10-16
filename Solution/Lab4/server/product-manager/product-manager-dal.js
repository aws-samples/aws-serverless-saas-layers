// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

'use strict';

const logManager = require('/opt/nodejs/log-manager.js');
const metricsManager = require('/opt/nodejs/metrics-manager.js');
const partitionManager = require('/opt/nodejs/partition-manager.js');
const tokenManager = require('/opt/nodejs/token-manager.js');

const doc = require('dynamodb-doc');
const dynamodb = new doc.DynamoDB();

// Get a product from DynamoDB
module.exports.getProduct = function(event, callback) {
    logManager.log(event, "ProductManager", { "Message": "DAL GetProduct() called.", "ProductId" : event.pathParameters.resourceId});

    const start = new Date().getTime();
    const tenantId = tokenManager.getTenantId(event);
    partitionManager.getPartition(event, partitionManager.PRODUCT_MANAGER, event.pathParameters.resourceId, function(tableName) {
        let params;
        if (tableName.indexOf('Pooled') >=0){
            params = {
                "TableName": tableName,
                "Key": {
                    TenantId: tenantId,
                    ProductId: event.pathParameters.resourceId
                }
            };
        } else {
            params = {
                "TableName": tableName,
                "Key": {
                    ProductId: event.pathParameters.resourceId
                }
            }
        }


        dynamodb.getItem(params, (err, data) => {
            let response;
            if (err){
                console.log(err);
                response = createResponse(500, err);
            }
            else
                response = createResponse(200, data.Item ? data.Item.doc : null);

            const end = new Date().getTime();
            metricsManager.recordMetricEvent(event, "ProductManager", "GetProduct", event, end - start);
            callback(response);
        });
    });
};

// Add or update a product to DynamoDB
module.exports.updateProduct = (event, callback) => {
    logManager.log(event, "ProductManager", {"Message": "DAL UpdateProduct() called.", "ProductId" : event.pathParameters.resourceId});

    const start = new Date().getTime();    
    const tenantId = tokenManager.getTenantId(event);
    partitionManager.getPartition(event, partitionManager.PRODUCT_MANAGER, event.pathParameters.resourceId, function(tableName) {
        const item = {
            "TenantId": tenantId,
            "ProductId": event.pathParameters.resourceId,
            "doc": event.body
        };

        const params = {
            "TableName": tableName,
            "Item": item
        };
        
        dynamodb.putItem(params, (err) => {
            let response;
            if (err) {
                console.log(err);
                response = createResponse(500, err);
            }
            else
                response = createResponse(200, null);
            
            const end = new Date().getTime();
            metricsManager.recordMetricEvent(event, "ProductManager", "UpdateProduct", event, end - start);   
            callback(response);
        });        
    });
};

// delete a product from DynamoDB
module.exports.deleteProduct = (event, callback) => {
    logManager.log(event, "ProductManager", {"Message": "DAL deleteProduct() called.", "ProductId" : event.pathParameters.resourceId});

    const start = new Date().getTime();  
    const tenantId = tokenManager.getTenantId(event);
    partitionManager.getPartition(event, partitionManager.PRODUCT_MANAGER, event.pathParameters.resourceId, function(tableName) {
        
        let params;
        if (tableName.indexOf('Pooled') >=0){
            params = {
                "TableName": tableName,
                "Key": {
                    TenantId: tenantId,
                    ProductId: event.pathParameters.resourceId
                }
            };
        } else {
            params = {
                "TableName": tableName,
                "Key": {
                    ProductId: event.pathParameters.resourceId
                }
            }
        }

        dynamodb.deleteItem(params, (err) => {
            let response;
            if (err){
                console.log(err);
                response = createResponse(500, err);
            }
            else
                response = createResponse(200, null);

            const end = new Date().getTime();
            metricsManager.recordMetricEvent(event, "ProductManager", "DeleteProduct", event, end - start);
            callback(response);
        });
    });
};

const createResponse = (statusCode, body) => {
    return {
        "statusCode": statusCode,
        "body": body || ""
    }
};