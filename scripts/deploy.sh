#!/bin/bash

S3_BUCKET="blog.eliperkins.me"
CLOUDFRONT_DISTRIBUTION_ID="E8K9XZBPL2CEJ"

echo "📤 Syncing output to s3://$S3_BUCKET"
aws s3 sync ./out "s3://$S3_BUCKET"
POLICY=$(cat << JSON
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": ["s3:GetObject"],
    "Resource": ["arn:aws:s3:::$S3_BUCKET/*"]
  }]
}
JSON
)
aws s3api put-bucket-policy --bucket "$S3_BUCKET" --policy "$POLICY"

echo "📡 Invalidating Cloudfront cache for $CLOUDFRONT_DISTRIBUTION_ID"
aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*" --no-cli-pager
