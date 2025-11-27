#!/bin/bash

# Kill any process running on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start the dev server
cd "$(dirname "$0")/.."
pnpm dev

