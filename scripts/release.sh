#!/bin/bash -e

: ${NPM_TAG:="latest"}

if ! [ "${PWD##*/}" == "recompose" ]; then
  echo >&2 "Please run scripts/release.sh from the repo root"
  exit 1
fi

update_version() {
  echo "$(node -p "p=require('./${1}');p.version='${2}';JSON.stringify(p,null,2)")" > $1
  echo "Updated ${1} version to ${2}"
}

validate_semver() {
  if ! [[ $1 =~ ^[0-9]\.[0-9]+\.[0-9](-.+)? ]]; then
    echo >&2 "Version $1 is not valid! It must be a valid semver string like 1.0.2 or 2.3.0-beta.1"
    exit 1
  fi
}

current_version=$(node -p "require('./package').version")

printf "Next version (current is $current_version)? "
read next_version

validate_semver $next_version

next_ref="v$next_version"

npm test -- --single-run

read -p "Continuing will commit changes, tag the commit, and publish recompose@$next_ref to npm with tag $NPM_TAG. Okay? " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

update_version 'package.json' $next_version

git commit -am "Version $next_version"

git tag $next_ref

git push origin master
git push origin $next_ref

npm run clean
npm run build
cp -f README.md .npmignore release

echo "$(node -p "p=require('./package.json');delete p.private;JSON.stringify(p,null,2)")" > release/package.json

cd release && npm publish . --tag $NPM_TAG
