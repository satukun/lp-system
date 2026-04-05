#!/bin/bash
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
exec /opt/homebrew/bin/node node_modules/.bin/next dev --webpack
