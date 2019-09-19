#!/usr/local/env bash

set -e;

git add ./src
git add ./package.json
git add ./pushToGit.sh
git commit -m "bashed commit"
#git remote rm origin
git remote add origin https://github.com/MrSoir/RandomReactComponents.git
git push -u origin master
