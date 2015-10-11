#!/bin/bash -e

BIN=node_modules/.bin

$BIN/webpack src/index.js dist/recompose.min.js
size=$($BIN/gzip-size dist/recompose.min.js | $BIN/pretty-bytes)
echo "Total gzipped size: $size"
sed -i '' "s/<!-- gzipped-size --> *[0-9\.]* kB *<!-- end -->/<!-- gzipped-size -->$size<!-- end -->/" README.md
