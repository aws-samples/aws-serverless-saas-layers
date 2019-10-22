// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

'use strict';
const helper = require('./helper.js');

//Log a message with no tenant context
module.exports.log = function(eventSource, message) {
   
    console.log(JSON.stringify(message));
 
    const currentTime = Math.floor(new Date() / 1000).toString();
    const key = eventSource + '/' + currentTime;
    message.timestamp = (new Date()).toISOString().substr(0, 19).replace('T',' ');
    helper.uploadToS3(process.env.LogsBucketName, key, JSON.stringify(message));
    
};
