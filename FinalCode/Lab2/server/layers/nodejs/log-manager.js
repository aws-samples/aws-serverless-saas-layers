// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

'use strict';
const helper = require('./helper.js');
const tokenManager = require('./token-manager.js');

//Log a message with no tenant context
module.exports.log = function(event, eventSource, message) {
   
    console.log(JSON.stringify(message));
    
    //Extract and Add tenant id to the log message
    const tenantId = tokenManager.getTenantId(event);
    message.tenantId = tenantId;
    

    const currentTime = Date.now()
    const key = eventSource + '/' + currentTime;
    message.timestamp = (new Date()).toISOString().substr(0, 19).replace('T',' ');

    helper.uploadToS3(process.env.LogsBucketName, key, JSON.stringify(message));
    
};
