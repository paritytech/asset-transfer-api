#!/bin/sh
test=$1
yarn run build:e2e &&
if [ $test = '--assets' ]; then
  script=post
elif [ $test = '--local' ]; then
  script=post
elif [ $test = '--liquidity-assets' ]; then
  script=liquidity-assets
elif [ $test = '--foreign-assets' ]; then
  script=foreign-assets
fi

yarn run start:zombienet-$script-script

sleep 24

node ./e2e-tests/build/e2e-tests/executor.js $test
