// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

'use strict';

const logManager = require('/opt/nodejs/log-manager.js');
const dal = require('./product-manager-dal.js');

// Fetch the product with the supplied ProductId
exports.get = (event, context, callback) => {
    logManager.log(event, "ProductManager", {"Message": "GetProduct() called.", "ProductId" : event.pathParameters.resourceId});

    dal.getProduct(event, function(response) {
        callback(null, response);
    });
};

// Add/update a product
exports.put = (event, context, callback) => {
    logManager.log(event, "ProductManager", {"Message": "PutProduct() called.", "ProductId" : event.pathParameters.resourceId});

    dal.updateProduct(event, function(response) {
        callback(null, response);
    });
};

// delete the product with the supplied ProductId
exports.delete = (event, context, callback) => {
    logManager.log(event, "ProductManager", {"Message": "deleteProduct() called.", "ProductId" : event.pathParameters.resourceId});

    dal.deleteProduct(event, function(response) {
        callback(null, response);
    });
};

