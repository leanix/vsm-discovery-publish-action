import * as core from '@actions/core';
import validateIntegration from './integration.validator';

function run(): void {
  const integrationJsonPath: string = core.getInput('integration-json');

  if (!integrationJsonPath) {
    core.setFailed('Please provide a path to the integration JSON file');
  }

  try {
    console.log(process.env);
    validateIntegration(integrationJsonPath);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
