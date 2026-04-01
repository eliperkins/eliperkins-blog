#!/bin/bash
set -e

FUNCTION_NAME="blog-markdown-redirect"
FUNCTION_FILE="cloudfront/markdown-redirect/index.js"
CLOUDFRONT_DISTRIBUTION_ID="E8K9XZBPL2CEJ"

echo "🔧 Deploying CloudFront function: $FUNCTION_NAME"

CREATED=false
if aws cloudfront describe-function --name "$FUNCTION_NAME" --no-cli-pager > /dev/null 2>&1; then
  echo "📝 Updating existing function..."
  ETAG=$(aws cloudfront describe-function --name "$FUNCTION_NAME" --query 'ETag' --output text --no-cli-pager)
  aws cloudfront update-function \
    --name "$FUNCTION_NAME" \
    --function-config Comment="Redirects to markdown on Accept header",Runtime=cloudfront-js-2.0 \
    --function-code fileb://"$FUNCTION_FILE" \
    --if-match "$ETAG" \
    --no-cli-pager > /dev/null
  echo "✅ Function code updated"
else
  echo "🆕 Function not found, creating..."
  aws cloudfront create-function \
    --name "$FUNCTION_NAME" \
    --function-config Comment="Redirects to markdown on Accept header",Runtime=cloudfront-js-2.0 \
    --function-code fileb://"$FUNCTION_FILE" \
    --no-cli-pager > /dev/null
  echo "✅ Function created"
  CREATED=true
fi

echo "📤 Publishing..."
aws cloudfront publish-function \
  --name "$FUNCTION_NAME" \
  --if-match "$(aws cloudfront describe-function --name "$FUNCTION_NAME" --query 'ETag' --output text)" \
  --no-cli-pager > /dev/null

echo "✅ Function deployed and published"

# Associate with distribution only on first creation
if [ "$CREATED" = true ]; then
  echo "🔗 Associating function with distribution (first-time setup)..."

  FUNCTION_ARN=$(aws cloudfront describe-function \
    --name "$FUNCTION_NAME" \
    --stage LIVE \
    --query 'FunctionSummary.FunctionMetadata.FunctionARN' \
    --output text \
    --no-cli-pager)

  aws cloudfront get-distribution-config \
    --id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --output json \
    --no-cli-pager > /tmp/dist-config.json

  DIST_ETAG=$(jq -r '.ETag' /tmp/dist-config.json)

  jq --arg arn "$FUNCTION_ARN" '
    .DistributionConfig.DefaultCacheBehavior.FunctionAssociations = {
      "Quantity": 1,
      "Items": [{
        "EventType": "viewer-request",
        "FunctionARN": $arn
      }]
    }
  ' /tmp/dist-config.json | jq '.DistributionConfig' > /tmp/dist-config-updated.json

  aws cloudfront update-distribution \
    --id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --if-match "$DIST_ETAG" \
    --distribution-config file:///tmp/dist-config-updated.json \
    --no-cli-pager > /dev/null

  rm -f /tmp/dist-config.json /tmp/dist-config-updated.json

  echo "✅ Function associated (distribution deploying, may take 5-10 minutes)"
fi
