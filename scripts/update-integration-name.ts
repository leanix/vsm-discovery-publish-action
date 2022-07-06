import * as core from '@actions/core';
import { throwErrorAndExit } from '../src/errors';
import IntegrationClient from '../src/client/integration.client';
import LeanixRegionService from '../src/service/leanix-region.service';

async function updateIntegrationName() {
  const [oldName, newName] = getOldAndNewIntegrationNames();
  const integrationClient = new IntegrationClient();
  const lxRegionService = new LeanixRegionService();

  for (const [region, regionId] of Object.entries(LeanixRegionService.REGIONS)) {
    const token = await lxRegionService.getMtmTokenForRegion(region, regionId);

    const integration = (await integrationClient.getIntegrations(regionId, token)).find((it) => it.name === oldName);
    if (!integration) {
      core.info(`Integration with name '${oldName}' does not exist in region '${region}' (update skipped)`);
    } else {
      integration.name = newName;
      await integrationClient.upsertIntegration(regionId, integration, token);
      core.info(`Integration name updated successfully in region ${region}`);
    }
  }
}

function getOldAndNewIntegrationNames(): [old: string, new: string] {
  const oldIntegrationName = process.argv[2];
  const newIntegrationName = process.argv[3];
  if (!oldIntegrationName || !newIntegrationName) {
    throwErrorAndExit(`Cannot get integration names from inputs`);
  }
  return [oldIntegrationName, newIntegrationName];
}

void updateIntegrationName();
