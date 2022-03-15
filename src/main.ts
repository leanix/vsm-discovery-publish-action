import * as core from '@actions/core';
import validateIntegration from './integration.validator';

function run(): void {
  try {
    const integrationId: string = core.getInput('integration-id');
    const integrationJsonPath: string = core.getInput('integration-json');
    const translationJsonPath: string = core.getInput('translation-json');

    validateIntegration(integrationId, integrationJsonPath, translationJsonPath);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
