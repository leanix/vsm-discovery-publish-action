import * as core from '@actions/core';
import fs from 'fs-extra';
import { IntegrationClient } from './client/integration.client';
import { LeanixRegionClient } from './client/leanix-region.client';
import { IntegrationRequestDto } from './models/integration-request-dto';
import IntegrationValidator from './validators/integration.validator';

async function run(): Promise<void> {
  const integrationJsonPath = core.getInput('integration-json');
  const dryRun = core.getInput('dry-run');
  let integration: IntegrationRequestDto;

  const integrationValidator = new IntegrationValidator();

  if (!integrationJsonPath) {
    throwErrorAndExit('Please provide a path to the integration JSON file');
  }

  try {
    integration = fs.readJsonSync(integrationJsonPath);
  } catch (error) {
    throw new Error(`Could not read integration JSON from path '${integrationJsonPath}'`);
  }

  try {
    await integrationValidator.validate(integration);
    core.info(`Integration ${integration.name} is valid`);

    if (dryRun !== 'true') {
      await postIntegrationToAllRegions(integration);
    }
  } catch (error) {
    if (error instanceof Error) {
      throwErrorAndExit(error.message);
    }
    throwErrorAndExit(`${error}`);
  }
}

async function postIntegrationToAllRegions(integration: IntegrationRequestDto): Promise<void> {
  const lxRegionClient = new LeanixRegionClient();
  const integrationClient = new IntegrationClient();

  for (const [region, regionId] of Object.entries(LeanixRegionClient.REGIONS)) {
    const token = await lxRegionClient.getMtmTokenForRegion(region, regionId);
    await integrationClient.upsertIntegration(regionId, integration, token);
    core.info(`Integration posted successfully to region ${region}`);
  }
}

export function throwErrorAndExit(message: string) {
  core.setFailed(message);
  process.exit(1);
}

void run();
