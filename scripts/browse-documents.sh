#!/bin/bash
# browse-documents.sh — reads a tab-separated "pubUrl\townerDid\tsiteValue" line from $1
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.." || exit 1

IFS=$'\t' read -r pub_url owner_did site_value <<< "$1"

yarn tsx scripts/browse-documents.ts "$pub_url" "$owner_did" "$site_value" \
  | fzf --delimiter $'\t' --with-nth 2,3 --header "$pub_url" \
        --preview 'goat get {4}' \
        --bind 'enter:execute(open {1})'
