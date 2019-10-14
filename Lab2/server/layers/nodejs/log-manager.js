// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

'use strict';
const helper = require('./helper.js');
//TODO: Add reference of token manager

//Log a message with no tenant context
module.exports.log = function(event, eventSource, message) {
   
    console.log(JSON.stringify(message));
    
    //TODO: Extract Tenant ID from JWT using token Manager and add to the message

    const currentTime = Date.now()
    const key = eventSource + '/' + currentTime;
    message.timestamp = (new Date()).toISOString().substr(0, 19).replace('T',' ');

    helper.uploadToS3(process.env.LogsBucketName, key, JSON.stringify(message));
    
};
