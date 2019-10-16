# Setup Cloud9

If you are running this lab as part an AWS event, then the Cloud9 should already be setup in the AWS accounts provided to you by your instructor. Please skip this section if this is the case. 

If you are running this lab on your own, then follow these instructions to setup Cloud9 in your AWS account.

<b>Step 1</b>: Navigate to https://raw.githubusercontent.com/aws-samples/aws-serverless-saas-layers/master/Cloud9Setup/saas-cfn-cloud9-stack.yaml. This will display the contents of saas-cfn-cloud9-stack.yaml in your browser. 

<b>Step 2</b>: Copy the contents of this file and save in your local machine as a file by the name of saas-cfn-cloud9-stack.yaml

<b>Step 3</b>: You can now use this yaml file to create a new stack in your AWS Account. Name the stack “saas-cfn-cloud9-stack”. Alternatively, you can use below command, if you have AWS CLI installed on your machine. This will automatically deploy the stack and eventually setup Cloud9 for you.

```
aws cloudformation deploy --template-file saas-cfn-cloud9-stack.yaml --stack-name saas-cfn-cloud9-stack
```