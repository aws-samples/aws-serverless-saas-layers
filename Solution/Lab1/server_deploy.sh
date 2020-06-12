# Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

curdate=`date +%s`

#create a bucket to push the sam code
aws s3 mb s3://serverless-saas-layers$curdate

#package the sam code
sam package --template-file server/saas-sam-stack.yaml --output-template-file server/sam-output.yaml --s3-bucket serverless-saas-layers$curdate --region us-east-1

# Deploy layers and functions
sam deploy --template-file server/sam-output.yaml --stack-name saas-sam-stack --capabilities CAPABILITY_IAM --region us-east-1

#Deploy CFN for S3 buckets and Athena Tables  
aws cloudformation deploy --template-file server/saas-cfn-stack.yaml --stack-name saas-cfn-stack