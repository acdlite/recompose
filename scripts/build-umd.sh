#!/bin/bash -e

BIN=node_modules/.bin

$BIN/webpack src/index.js dist/recompose.min.js
size=$($BIN/gzip-size dist/recompose.min.js)
echo "Gzipped size: $size"
