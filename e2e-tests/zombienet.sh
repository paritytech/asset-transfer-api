#!/bin/sh
if [ $(uname) = 'Darwin' ]; then
  os='zombienet-macOS'
elif [ $(uname) = 'Linux' ]; then
  if [ $(uname -m) = 'x86_64' ]; then
    os='zombienet-linux-x64'
  elif [ $(uname -m) = 'arm64' ]; then
    os='zombienet-linux-arm64'
  fi
fi

sed -i 's="./zombienet/zombienet": .*"="./zombienet/zombienet": "'$os' -p native spawn ./zombienet/medium-network.toml"=' package.json

yarn run zombienet