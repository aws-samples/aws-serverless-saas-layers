# Package layers for deployment
sam package --template-file saas-sam-stack.yaml --output-template-file sam-output.yaml --s3-bucket serverless-saas-layers --region us-east-1

# Deploy layers and functions
sam deploy --template-file sam-output.yaml --stack-name saas-sam-stack --capabilities CAPABILITY_IAM --region us-east-1

#Deploy CFN for S3 buckets and Athena Tables  
aws cloudformation deploy --template-file saas-cfn-stack.yaml --stack-name saas-cfn-stack


