// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();
const AWS = require('aws-sdk');
const s3 = new AWS.S3({apiVersion: '2006-03-01'});


// Create table helper function that creates the supplied table if it
// does not already exist
module.exports.createTable = function (tableDefinition, callback) {
    var newTable = {
        TableName: tableDefinition.TableName
    };
    
    dynamo.describeTable(newTable, function (error) {
        if (!error) {
            console.log("Table already exists: " + tableDefinition.TableName);
            callback(null);
        }
        else {
            dynamo.createTable(tableDefinition, function (err) {
                if (err) {
                    console.log("Unable to create table: " + tableDefinition.TableName + " Error: " + err);
                    callback(err);
                } else {
                    var tableName = {TableName: tableDefinition.TableName};
                    dynamo.waitFor('tableExists', tableName, function (err, data) {
                        if (err)
                            callback(err);
                        else {
                            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
                            callback(null);
                        }
                    });
                }
            });
        }
    });
 }

module.exports.uploadToS3 = function(bucketname, key, body){
    const uploadParams = {Bucket: bucketname, Key: key, Body: body};

    s3.upload (uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data.Location);
        }
    });
 }