// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

'use strict';

//TODO: Fix this reference to refer the layers. 
const logManager = require('log-manager.js');

const dal = require('./order-manager-dal.js');

// Fetch the order with the supplied OrderId
exports.get = (event, context, callback) => {
    logManager.log(event, "OrderManager", {"Message": "GetOrder() called.", "OrderId" : event.pathParameters.resourceId});

    dal.getOrder(event, function(response) {
        callback(null, response);
    });
};

// Update/add an order 
exports.put = (event, context, callback) => {
    logManager.log(event, "OrderManager", {"Message": "PutOrder() called.", "OrderId" : event.pathParameters.resourceId});

    dal.updateOrder(event, function(response) {
        callback(null, response);
    });
};

// delete the order with the supplied OrderId
exports.delete = (event, context, callback) => {
    logManager.log(event, "OrderManager", {"Message": "deleteOrder() called.", "OrderId" : event.pathParameters.resourceId});

    dal.deleteOrder(event, function(response) {
        callback(null, response);
    });
};

