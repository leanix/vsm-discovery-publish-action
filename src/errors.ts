import * as core from '@actions/core';

export function throwErrorAndExit(message: string) {
  core.setFailed(message);
  process.exit(1);
}
