#!/bin/sh
set -a
if [ $MODE = "production" ]; then
    source .env
else
    source .env.development
fi
set +a 

printenv

npm run start
# npm run dev