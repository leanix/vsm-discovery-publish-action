import * as core from '@actions/core';
import { throwErrorAndExit } from '../src/main';
import { IntegrationClient } from '../src/client/integration.client';
import { LeanixRegionClient } from '../src/client/leanix-region.client';

async function deleteIntegrationByNameToAllRegions() {
  const integrationName = getInput();
  const integrationClient = new IntegrationClient();
  const lxRegionClient = new LeanixRegionClient();

  for (const [region, regionId] of Object.entries(LeanixRegionClient.REGIONS)) {
    const token = await lxRegionClient.getMtmTokenForRegion(region, regionId);

    const integration = (await integrationClient.getIntegrations(regionId, token)).find((it) => it.name === integrationName);
    if (!integration) {
      core.info(`Integration with name '${integrationName}' does not exist in region '${region}' (deletion skipped)`);
    } else {
      await integrationClient.deleteIntegration(regionId, integration!.id, token);
      core.info(`Integration deleted successfully to region ${region}`);
    }
  }
}

function getInput() {
  try {
    return process.argv[2];
  } catch (error) {
    throwErrorAndExit(`Cannot get integration name from inputs`);
  }
}

void deleteIntegrationByNameToAllRegions();
