# Lab2 – Code re-usability and multi-tenancy using Lambda Layers
The next step in this process is to begin to make our move to a multi-tenant solution that leverages Lambda layers to hide away the details of multi-tenancy. The lab will guide you through the process of carving out and moving constructs to layers and adding multi-tenant context to our single-tenant solution. Our multi-tenant focus in this lab will start with logging. A multi-tenant environment needs to emit logs that include tenant context. At the same time, we don’t want developers figuring out how to inject that context. Instead, we want our logging frameworks and tooling to inject this tenant context on our behalf. It’s a very basic mechanism, but it will emit logs that will be essential to track down and troubleshoot the activity of individual tenants. For this particular lab, we’ll be using layers as a way to introduce this logging functionality in a way that can be reused by all of our functions.

<b>Step 1</b>: Let’s first explore the code a bit to see how we have used Layers to provide Logging service as a reusable construct. Inside your Cloud9 IDE, Navigate to serverless-saas-layers -> Lab2 -> server -> layers folder. Our CloudFormation, for this Lab, deploys this folder inside S3 and makes available to all the Lambda function that references it. Note the nodejs folder inside layers. This naming convention ensures that all the content inside this folder is available to any Lambda function using nodejs runtime.

<b>Step 2</b>: The first step is to add a token manager class to the server section of this lab. Navigate to the folder Lab2 -> server -> layers -> nodejs. Create a new file and call it token-manager.js. Add the below code to the token-manager.js file and save the file.

```javascript
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
```

Now, let’s add a reference to the token-manager in the log-manager.js file. Locate the log-manager.js file in the same folder and replace the TODO with it’s corresponding code snippet below

```javascript
//TODO: Add reference of token manager
const tokenManager = require('./token-manager.js');
```

```javascript
//TODO: Extract Tenant ID from JWT using token Manager and add to the message
//Extract and Add tenant id to the log message
const tenantId = tokenManager.getTenantId(event);
message.tenantId = tenantId;
```

The intent here is to extract the tenantId inside the JWT payload of the request header and add to the message before logging it. This ensures that each log message is now tenant-aware. Now, save the file.

<b>Step 3</b>: Now, let’s fix the reference of log-manager inside order-manager and product-manager.

Open /server/order-manager/order-manager-dal.js file. Look for the below TODOs and replace the existing logManager constant with the below implementation. Notice that log-manager.js is under the /opt/nodejs. This means that now log-manager is a shared construct unlike what we saw in Lab1.

```javascript
//TODO: Fix this reference to refer the layers.
const logManager = require('/opt/nodejs/log-manager.js');
```

Repeat the above step for order-manager.js, product-manager-dal.js, product-manager.js, and save all the files.

<b>Step 4</b>: In this step we will add references to layers inside “saas-sam-stack.yaml”

Open /server/saas-sam-stack.yaml. Look for the below TODO and replace with the DependencyLayer code.

```yaml
    #TODO: Add Layers definition here
    DependencyLayer:
        Type: AWS::Serverless::LayerVersion
        Properties:
            LayerName: sam-app-dependencies
            Description: Dependencies for centralized services
            ContentUri: layers/
            CompatibleRuntimes:
              - nodejs10.x
            LicenseInfo: 'MIT'
            RetentionPolicy: Retain
```

Now, in the same file, replace all instances of below TODO with the provided code.

```yaml
    #TODO: Add reference to Layers
    Layers: 
        - !Ref DependencyLayer
```

Save the saas-sam-stack.yaml file once this is complete.

<b>Step 5</b>: Now navigate to the folder Lab2->client. In this step modify the utils.py to add a create_jwt method. Look for below TODO and replace with the code below.

```python
#TODO: Add a static method to create JWT token which has tenantId in it
@staticmethod
def create_jwt():
    encoded_jwt = jwt.encode({'tenantId': random.choice(['tenant1', 'tenant2', 'tenant3'])}, SECRET_KEY, algorithm='HS256')
    return encoded_jwt.decode("utf-8")
```

Now, add JWT to the Authorization header as shown below. Look for TODO
```python
#TODO: Add Authorization header with JWT
"Authorization":"Bearer " + Utils.create_jwt()
```

Make sure to add a comma in the previous line after 
```python
"Content-Type": "application/json", 
```
Save the file.

<b>Step 6</b>: Now let’s deploy this new code. To do so, change current directory to “serverless-saas-layers/Lab2” inside cloud9 Terminal window. Run the below two commands to deploy the cloud formation for this Lab. Wait for this command to finish. This will deploy our Lambda Layers as well as multi-tenant logger.
```
chmod +x server_deploy.sh
. server_deploy.sh
```
<b>Step 7</b>: Now run the load_simulator.sh script using below commands. Let this finish before proceeding. Follow the same process to get API Gateway URL as described in Lab1. The URL should be same as before. 
```
chmod +x load_simulator.sh
. load_simulator.sh <API GATEWAY URL> 
```
<b>Step 8</b>: We will now run Athena queries to see the new log messages. Go to Athena, inside Services, and select “serverlesssaas” database from the database drop down on the left. Run below query by clicking “Run query” button to see logs for order service and explore the results.
```sql
select * from Orderlogs order by timestamp
```

<p align="center"><kbd><img src="../Images/Lab2-AthenaResults.png" alt="Lab 2 - Athena Results"/></kbd></p>

Below query will provide logs for product service.
```sql
select * from Productlogs order by timestamp
```
You will now notice tenantId inside logged messages. Our queries can now aggregate and separate logs by tenantId by using it in group by and where clauses. Run below query to see this in action.
```sql
select * from Orderlogs 
where tenantid='tenant1'
order by timestamp
```

You have now completed Lab 2. 

[Continue to Lab 3](../Lab3/README.md)
