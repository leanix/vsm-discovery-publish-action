# Validate Integration Action

This Action takes an integration config JSON file as input and checks its validity according to the schema defined in [@leanix/nexus](https://github.com/leanix/nexus).

## Setup

> Recent node version, (node >= 9)

Install the dependencies

```bash
$ npm install
```

Build the typescript and package it for distribution

```bash
$ npm run build && npm run package
```

## Publishing

**Do not push any changes to the dist folder, as those changes will be overridden**. When changing the validator, the dist folder will be automatically re-built and added to the current PR. This action is run from GitHub repositories, for this reason the dist folder must be checked in.

After your PR has been merged, your changes are published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
d
