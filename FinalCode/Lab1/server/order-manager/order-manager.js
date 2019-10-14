// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

'use strict';

let logManager = require('./Utils/log-manager.js');
let dal = require('./order-manager-dal.js');

// Fetch the order with the supplied OrderId
exports.get = (event, context, callback) => {
    logManager.log("OrderManager", {"Message": "GetOrder() called.", "OrderId" : event.pathParameters.resourceId});

    dal.getOrder(event, function(response) {
        callback(null, response);
    });
};

// Update/add an order 
exports.put = (event, context, callback) => {
    logManager.log("OrderManager", {"Message": "PutOrder() called.", "OrderId" : event.pathParameters.resourceId});

    dal.updateOrder(event, function(response) {
        callback(null, response);
    });
};

// Delete the order with the supplied OrderId
exports.delete = (event, context, callback) => {
    logManager.log("OrderManager", {"Message": "DeleteOrder() called.", "OrderId" : event.pathParameters.resourceId});

    dal.deleteOrder(event, function(response) {
        callback(null, response);
    });
};

