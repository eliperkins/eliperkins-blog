#!/bin/bash
set -e

FUNCTION_NAME="blog-markdown-redirect"
FUNCTION_FILE="cloudfront/markdown-redirect/index.js"

echo "🔧 Deploying CloudFront function: $FUNCTION_NAME"

if aws cloudfront update-function-code \
  --name "$FUNCTION_NAME" \
  --function-code fileb://"$FUNCTION_FILE" \
  --if-match "$(aws cloudfront describe-function --name "$FUNCTION_NAME" --query 'ETag' --output text 2>/dev/null)" \
  --no-cli-pager > /dev/null 2>&1; then
  echo "✅ Function code updated"
else
  echo "🆕 Function not found, creating..."
  aws cloudfront create-function \
    --name "$FUNCTION_NAME" \
    --function-config Comment="Redirects to markdown on Accept header",Runtime=cloudfront-js-2.0 \
    --function-code fileb://"$FUNCTION_FILE" \
    --no-cli-pager > /dev/null
  echo "✅ Function created"
fi

echo "📤 Publishing..."
aws cloudfront publish-function \
  --name "$FUNCTION_NAME" \
  --if-match "$(aws cloudfront describe-function --name "$FUNCTION_NAME" --query 'ETag' --output text)" \
  --no-cli-pager > /dev/null

echo "✅ Function deployed and published"
