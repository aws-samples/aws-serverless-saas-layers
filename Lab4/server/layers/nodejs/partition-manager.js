// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

'use strict'

const tokenManager = require('./token-manager.js');
const logManager = require('./log-manager.js');
const helper = require('./helper.js');

const PRODUCT_MANAGER = "ProductManager";
const ORDER_MANAGER = "OrderManager";

const MODEL_SILO = "Silo";
const MODEL_POOL = "Pool";

module.exports.PRODUCT_MANAGER = PRODUCT_MANAGER;
module.exports.ORDER_MANAGER = ORDER_MANAGER;


// A hard-codeded mapping of partitioning the partitioning scheme. 
//This would likely come from a configuration service/database.
const partitionMap = new Map([
    ['ProductManager', 
        {'ServiceType': 'ProductService', 'Model': 'Pool', 'TableName': 'Product'}
    ],
    ['OrderManager', 
        {'ServiceType': 'OrderService', 'Model': 'Silo', 'TableName': 'Order'}
    ]
]);

// Use the incoming context of the tenant and service to acquire the partitioning model
// for this particular service. 
module.exports.getPartition = function(event, serviceId, resourceId, callback) {
    logManager.log(event, serviceId, { "Message": "Partition Manager: getPartition().", "OrderId" : resourceId});

    const tenantId = tokenManager.getTenantId(event);

    lookupPartition(tenantId, serviceId, function(partitionDescriptor) {
        logManager.log(event, serviceId, { "Message": "Partition Manager: partition table is: " + partitionDescriptor.TableName, "OrderId" : event.pathParameters.resourceId});
        
        if (serviceId == PRODUCT_MANAGER) {
            createTenantProductTable(tenantId, partitionDescriptor.TableName, partitionDescriptor.Model, function(tableName) {
                callback(tableName);
            });
        }
        else if (serviceId == ORDER_MANAGER) {
            createTenantOrderTable(tenantId, partitionDescriptor.TableName, partitionDescriptor.Model, function(tableName) {
                callback(tableName);
            });
        }
        else {
            callback(null);
        }
    });
}

// Lookup the partition in the configuration map using service context
function lookupPartition(tenantId, serviceId, callback) {
    console.log('looking up partition, tenantId =  ' + tenantId + ' serviceId = ' + serviceId);

    if (partitionMap.has(serviceId))
      callback(partitionMap.get(serviceId));
    else
      callback(null);
}

// Create a product table for the tenant(s). The partitioning scheme configured for
// this environment/service will determine if this is a pooled or siloed table.
function createTenantProductTable(tenantId, tableName, model, callback) {
    console.log('Creating Product Table, table Name: ' + tableName);

    let tableDefinition;
    if(model == MODEL_POOL){
        tableDefinition = {
            AttributeDefinitions: [ {
            AttributeName: "TenantId", 
            AttributeType: "S"
            },
            {
            AttributeName: "ProductId", 
            AttributeType: "S"
            } ], 
            KeySchema: [ {
            AttributeName: "TenantId", 
            KeyType: "HASH"
            },
            {
            AttributeName: "ProductId", 
            KeyType: "RANGE"
            } ], 
            ProvisionedThroughput: {
            ReadCapacityUnits: 5, 
            WriteCapacityUnits: 5
            }, 
            TableName: tableName + "-Pooled"
        };
    }
    else  if (model == MODEL_SILO){
        tableDefinition = {
            AttributeDefinitions: [ {
              AttributeName: "ProductId", 
              AttributeType: "S"
            } ], 
            KeySchema: [ {
              AttributeName: "ProductId", 
              KeyType: "HASH"
            } ], 
            ProvisionedThroughput: {
             ReadCapacityUnits: 5, 
             WriteCapacityUnits: 5
            }, 
            TableName: tableName + "-Silo-" + tenantId
        };
    }
    helper.createTable(tableDefinition, function() {
        callback(tableDefinition.TableName);
    });
}

// Create an order table for the tenant(s). The partitioning scheme configured for
// this environment/service will determine if this is a pooled or siloed table.
function createTenantOrderTable(tenantId, tableName, model, callback) {
    console.log('Creating Order Table, tenantId: ' + tenantId + ' table Name: ' + tableName);
    let tableDefinition;
    if(model == MODEL_POOL){
        tableDefinition = {
            AttributeDefinitions: [ {
            AttributeName: "TenantId", 
            AttributeType: "S"
            },
            {
            AttributeName: "OrderId", 
            AttributeType: "S"
            } ], 
            KeySchema: [ {
            AttributeName: "TenantId", 
            KeyType: "HASH"
            },
            {
            AttributeName: "OrderId", 
            KeyType: "RANGE"
            } ], 
            ProvisionedThroughput: {
            ReadCapacityUnits: 5, 
            WriteCapacityUnits: 5
            }, 
            TableName: tableName + "-Pooled"
        };
    }
    else if (model == MODEL_SILO){
        tableDefinition = {
            AttributeDefinitions: [ {
              AttributeName: "OrderId", 
              AttributeType: "S"
            } ], 
            KeySchema: [ {
              AttributeName: "OrderId", 
              KeyType: "HASH"
            } ], 
            ProvisionedThroughput: {
             ReadCapacityUnits: 5, 
             WriteCapacityUnits: 5
            }, 
            TableName: tableName + "-Silo-" + tenantId
        };
    }
    
    helper.createTable(tableDefinition, function() {
        callback(tableDefinition.TableName);
    });
}