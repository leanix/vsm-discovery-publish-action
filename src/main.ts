import * as core from '@actions/core';
import fs from 'fs-extra';
import { IntegrationRequestDto } from './models/integration-request-dto';
import IntegrationValidator from './validators/integration.validator';
import { throwErrorAndExit } from './errors';
import IntegrationService from './service/integration.service';

async function run(): Promise<void> {
  const integration = await getValidatedIntegrationRequestDto();
  const assetFolder = core.getInput('assets-folder');
  const dryRun = core.getInput('dry-run');

  const integrationService = new IntegrationService();

  try {
    if (dryRun !== 'true') {
      await integrationService.postIntegrationToAllRegions(integration);
      await integrationService.postAssetsToAllRegions(integration.name, assetFolder);
    }
  } catch (error) {
    if (error instanceof Error) {
      throwErrorAndExit(error.message);
    }
    throwErrorAndExit(`${error}`);
  }
}

async function getValidatedIntegrationRequestDto(): Promise<IntegrationRequestDto> {
  const integrationJsonPath = core.getInput('integration-json');

  if (!integrationJsonPath || typeof integrationJsonPath !== 'string') {
    throwErrorAndExit('Please provide a path to the integration JSON file');
  }

  try {
    const integration: IntegrationRequestDto = fs.readJsonSync(integrationJsonPath);

    const integrationValidator = new IntegrationValidator();
    await integrationValidator.validate(integration);
    core.info(`Integration ${integration.name} is valid`);

    return integration;
  } catch (error) {
    throw new Error(`Could not read integration JSON from path '${integrationJsonPath}'`);
  }
}

void run();
