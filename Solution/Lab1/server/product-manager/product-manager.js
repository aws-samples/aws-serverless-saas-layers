// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

'use strict';

let logManager = require('./Utils/log-manager.js');
let dal = require('./product-manager-dal.js');

// Fetch the product with the supplied ProductId
exports.get = (event, context, callback) => {
    logManager.log("ProductManager", {"Message": "GetProduct() called.", "ProductId" : event.pathParameters.resourceId});

    dal.getProduct(event, function(response) {
        callback(null, response);
    });
};

// Add/update a product
exports.put = (event, context, callback) => {
    logManager.log("ProductManager", {"Message": "PutProduct() called.", "ProductId" : event.pathParameters.resourceId});

    dal.updateProduct(event, function(response) {
        callback(null, response);
    });
};

// Delete the product with the supplied ProductId
exports.delete = (event, context, callback) => {
    logManager.log("ProductManager", {"Message": "DeleteProduct() called.", "ProductId" : event.pathParameters.resourceId});

    dal.deleteProduct(event, function(response) {
        callback(null, response);
    });
};

