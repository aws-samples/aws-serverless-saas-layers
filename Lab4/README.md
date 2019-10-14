This lab covers below experience:
1) Modify the data access layers to add calls to partition manager
2) User is then able to see how that affects the storage in dynamodb

In order to run:
1) Run . server_deploy.sh to deploy the solution in your AWS Account.
2) Retrieve the API Gateway URL of the deployed solution from your AWS Account (Example URL: “https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/Prod”).
3) Run . load_simulator.sh <API GATEWAY URL> to make API calls inorder to simulate a client.