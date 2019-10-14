// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

'use strict';

const nJwt = require('njwt');

const signingKey = "af92fb8f-ebbf-4df6-a54f-6355b0e9ea28";

// Get the tenant identifier from the supplied context
module.exports.getTenantId = function(event) {
    const bearerToken = event.headers['Authorization'];
    let tenantId = "";
    try {
        const jwtToken = bearerToken.substring(bearerToken.indexOf(' ') + 1);
        const verifiedJwt = nJwt.verify(jwtToken, signingKey);
        tenantId = verifiedJwt.body.tenantId;
    } catch(e) {
        console.log("Error verifying token: " + e);
    }

    return tenantId;
}
