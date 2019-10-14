// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

'use strict'

let helper = require('./helper.js');
const tokenManager = require('./token-manager.js');

// Recored metrics with no tenant context
module.exports.recordMetricEvent = function(event, eventSource, eventAction, context, currentDuration) {
    //Extract and Add tenant id to the message
    const tenantId = tokenManager.getTenantId(event);
    
    const metricEvent = {
        source: eventSource,
        type: "ApplicationService",
        action: eventAction,
        duration: currentDuration,
        timestamp: (new Date()).toISOString().substr(0, 19).replace('T',' '),
        tenantId: tenantId
    };
    
    const currentTime = Math.floor(new Date() / 1000).toString();
    const key = eventSource + '/' + currentTime;

    helper.uploadToS3(process.env.MetricsBucketName, key, JSON.stringify(metricEvent));
        
}