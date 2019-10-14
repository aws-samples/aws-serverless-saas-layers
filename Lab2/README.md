This lab covers below experience:
1) User to add token manager class to layers folder
2) User to add reference for token manager in log-manager.js and add code to extract tenant id in the logs'
3) User to fix reference of log-manager inside order manager and product manager
4) User to add reference of layers inside saas-sam-stack.yaml
5) User to modify the client utils.py and add JWT to the Authorization header

In order to run:
1) Run . server_deploy.sh to deploy the solution in your AWS Account.
2) Retrieve the API Gateway URL of the deployed solution from your AWS Account (Example URL: “https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/Prod”).
3) Run . load_simulator.sh <API GATEWAY URL> to make API calls inorder to simulate a client.