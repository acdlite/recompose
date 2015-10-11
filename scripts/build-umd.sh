#!/bin/bash -e

BIN=node_modules/.bin

$BIN/webpack src/index.js dist/recompose.min.js
size=$($BIN/gzip-size dist/recompose.min.js | $BIN/pretty-bytes)
echo "Total gzipped size: $size"
sed -i '' "s/The total gzipped size of the entire library is \*\*[0-9\.]* kB\*\*/The total gzipped size of the entire library is \*\*$size\*\*/" README.md
