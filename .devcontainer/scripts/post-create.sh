#!/usr/bin/env bash
set -euo pipefail

mkdir -p /home/vscode/.local/share/zsh

bun add --global @openai/codex

if [[ -f frontend/bun.lock ]]; then
  bun install --cwd frontend --frozen-lockfile
fi
