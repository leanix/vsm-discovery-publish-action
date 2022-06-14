#!/bin/bash

INTEGRATION_NAME=$1
ASSETS_PATH=$2

function random_string() {
  echo $RANDOM | base64 | head -c 20
}

ORG="leanix"
REPOSITORY_NAME="valuestreams-ui"
REPOSITORY="${ORG}/${REPOSITORY_NAME}"
FEATURE_BRANCH="vsm-discovery/publish-assets-$INTEGRATION_NAME-"$(random_string)

VALUESTREAMS_UI_ASSETS_PATH="libs/feature-integrations/src/assets/integrations/${INTEGRATION_NAME}"

function login() {
  echo $GITHUB_TOKEN > .githubtoken
  gh auth login --with-token < .githubtoken
  echo "Logged in to GitHub"
}

function setup_git() {
  git config --global user.name 'leanix-ci'
  git config --global user.email 'leanix-ci@users.noreply.github.com'
}

function setup_repository() {
  gh repo clone $REPOSITORY
  cd $REPOSITORY_NAME
  git checkout -b $FEATURE_BRANCH
  echo "Setuped repository '$REPOSITORY'"
}

function copy_assets() {
  mkdir -p $VALUESTREAMS_UI_ASSETS_PATH
  cp -r $ASSETS_PATH/* $VALUESTREAMS_UI_ASSETS_PATH
  echo "Copied assets to '$VALUESTREAMS_UI_ASSETS_PATH'"
} 

function commit_ans_push_assets() {
  git add $VALUESTREAMS_UI_ASSETS_PATH
  git commit -m "VSM Discovery: Update assets for $INTEGRATION_NAME"
  git push -u origin $FEATURE_BRANCH
  echo "Commited and pushed assets to '$REPOSITORY'"
}

function open_pr_and_approve() {
  gh pr create --fill
  gh pr merge $FEATURE_BRANCH --auto
  echo "Opened PR and enabled automerge for '$FEATURE_BRANCH'"
}

login
setup_git
setup_repository
copy_assets
commit_ans_push_assets
open_pr_and_approve
