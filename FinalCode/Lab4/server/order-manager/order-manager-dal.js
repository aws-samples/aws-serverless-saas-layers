// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

'use strict';

const logManager = require('/opt/nodejs/log-manager.js');
const metricsManager = require('/opt/nodejs/metrics-manager.js');
const partitionManager = require('/opt/nodejs/partition-manager.js');
const tokenManager = require('/opt/nodejs/token-manager.js');

const doc = require('dynamodb-doc');
const dynamodb = new doc.DynamoDB();

// Get an order from DynamoDB
module.exports.getOrder = function(event, callback) {
    logManager.log(event, "OrderManager", { "Message": "DAL GetOrder() called.", "OrderId" : event.pathParameters.resourceId});
    
    const start = new Date().getTime();
    const tenantId = tokenManager.getTenantId(event);
    partitionManager.getPartition(event, partitionManager.ORDER_MANAGER, event.pathParameters.resourceId, function(tableName) {
        let params;
        if (tableName.indexOf('Pooled') >=0){
            params = {
                "TableName": tableName,
                "Key": {
                    TenantId: tenantId,
                    OrderId: event.pathParameters.resourceId
                }
            };
        } else {
            params = {
                "TableName": tableName,
                "Key": {
                    OrderId: event.pathParameters.resourceId
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
            metricsManager.recordMetricEvent(event, "OrderManager", "GetOrder", event, end - start);
            callback(response);
        });   
    }); 
};

// Add or update an order to DynamoDB 
module.exports.updateOrder = (event, callback) => {
    logManager.log(event, "OrderManager", {"Message": "DAL UpdateOrder() called.", "OrderId" : event.pathParameters.resourceId});

    const start = new Date().getTime();
    const tenantId = tokenManager.getTenantId(event);
    partitionManager.getPartition(event, partitionManager.ORDER_MANAGER, event.pathParameters.resourceId, function(tableName) {
        const item = {
            "TenantId": tenantId,
            "OrderId": event.pathParameters.resourceId,
            "doc": event.body
        };

        const params = {
            "TableName": tableName,
            "Item": item
        };

        dynamodb.putItem(params, (err) => {
            let response;
            if (err){
                console.log(err);
                response = createResponse(500, err);
            }
            else
                response = createResponse(200, null);
            
            const end = new Date().getTime();
            metricsManager.recordMetricEvent(event, "OrderManager", "UpdateOrder", event, end - start);            
            callback(response);
        });        
    });
};

// delete an order from DynamoDB 
module.exports.deleteOrder = (event, callback) => {
    logManager.log(event, "OrderManager", {"Message": "DAL deleteOrder() called.", "OrderId" : event.pathParameters.resourceId});
    
    const start = new Date().getTime();
    const tenantId = tokenManager.getTenantId(event);
    partitionManager.getPartition(event, partitionManager.ORDER_MANAGER, event.pathParameters.resourceId, function(tableName) {
        let params;
        if (tableName.indexOf('Pooled') >=0){
            params = {
                "TableName": tableName,
                "Key": {
                    TenantId: tenantId,
                    OrderId: event.pathParameters.resourceId
                }
            };
        } else {
            params = {
                "TableName": tableName,
                "Key": {
                    OrderId: event.pathParameters.resourceId
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
            metricsManager.recordMetricEvent(event, "OrderManager", "DeleteOrder", event, end - start);
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