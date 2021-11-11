#!/bin/bash

set -xe

# Restore all git changes
git restore -s@ -SW  -- packages

# Resolve yarn
YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install

yarn build:i18n

# Release packages
for p in packages/* ; do
  pushd $p
  echo "Publishing $p"
  npm publish
  popd
done
