#!/bin/bash
set -e

CLOUDFRONT_DISTRIBUTION_ID="E8K9XZBPL2CEJ"
REQUEST_FUNCTION="blog-markdown-redirect"
RESPONSE_FUNCTION="blog-vary-accept"

function_etag() {
  aws cloudfront describe-function --name "$1" --query 'ETag' --output text --no-cli-pager
}

function_arn() {
  aws cloudfront describe-function \
    --name "$1" \
    --stage LIVE \
    --query 'FunctionSummary.FunctionMetadata.FunctionARN' \
    --output text \
    --no-cli-pager
}

deploy_function() {
  local name="$1"
  local file="$2"
  local comment="$3"

  echo "🔧 Deploying CloudFront function: $name"

  if aws cloudfront describe-function --name "$name" --no-cli-pager &>/dev/null; then
    echo "📝 Updating existing function..."
    aws cloudfront update-function \
      --name "$name" \
      --function-config Comment="$comment",Runtime=cloudfront-js-2.0 \
      --function-code fileb://"$file" \
      --if-match "$(function_etag "$name")" \
      --no-cli-pager > /dev/null
  else
    echo "🆕 Function not found, creating..."
    aws cloudfront create-function \
      --name "$name" \
      --function-config Comment="$comment",Runtime=cloudfront-js-2.0 \
      --function-code fileb://"$file" \
      --no-cli-pager > /dev/null
  fi

  echo "📤 Publishing..."
  aws cloudfront publish-function \
    --name "$name" \
    --if-match "$(function_etag "$name")" \
    --no-cli-pager > /dev/null

  echo "✅ $name deployed and published"
}

deploy_function \
  "$REQUEST_FUNCTION" \
  "cloudfront/markdown-redirect/index.js" \
  "Negotiates markdown on the Accept header"

deploy_function \
  "$RESPONSE_FUNCTION" \
  "cloudfront/vary-accept/index.js" \
  "Adds Vary: Accept to negotiated responses"

echo "🔗 Reconciling function associations..."

aws cloudfront get-distribution-config \
  --id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --output json \
  --no-cli-pager > /tmp/dist-config.json

DIST_ETAG=$(jq -r '.ETag' /tmp/dist-config.json)

jq --arg request "$(function_arn "$REQUEST_FUNCTION")" \
   --arg response "$(function_arn "$RESPONSE_FUNCTION")" '
  .DistributionConfig
  | .DefaultCacheBehavior.FunctionAssociations = {
      "Quantity": 2,
      "Items": [
        { "EventType": "viewer-request", "FunctionARN": $request },
        { "EventType": "viewer-response", "FunctionARN": $response }
      ]
    }
' /tmp/dist-config.json > /tmp/dist-config-updated.json

if jq -e --slurpfile updated /tmp/dist-config-updated.json \
  '.DistributionConfig == $updated[0]' /tmp/dist-config.json &>/dev/null; then
  echo "✅ Associations already current"
else
  aws cloudfront update-distribution \
    --id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --if-match "$DIST_ETAG" \
    --distribution-config file:///tmp/dist-config-updated.json \
    --no-cli-pager > /dev/null
  echo "✅ Associations updated (distribution deploying, may take 5-10 minutes)"
fi

rm -f /tmp/dist-config.json /tmp/dist-config-updated.json
