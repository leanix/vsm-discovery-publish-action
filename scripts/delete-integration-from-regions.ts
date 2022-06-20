import * as core from '@actions/core';
import { throwErrorAndExit } from '../src/errors';
import { IntegrationClient } from '../src/client/integration.client';
import { LeanixRegionClient } from '../src/client/leanix-region.client';

async function deleteIntegrationByNameFromAllRegions() {
  const integrationName = getIntegrationName();
  const integrationClient = new IntegrationClient();
  const lxRegionClient = new LeanixRegionClient();

  for (const [region, regionId] of Object.entries(LeanixRegionClient.REGIONS)) {
    const token = await lxRegionClient.getMtmTokenForRegion(region, regionId);

    const integration = (await integrationClient.getIntegrations(regionId, token)).find((it) => it.name === integrationName);
    if (!integration) {
      core.info(`Integration with name '${integrationName}' does not exist in region '${region}' (deletion skipped)`);
    } else {
      await integrationClient.deleteIntegration(regionId, integration!.id, token);
      core.info(`Integration deleted successfully from region ${region}`);
    }
  }
}

function getIntegrationName(): string {
  const integrationName = process.argv[2];
  if (!integrationName) {
    throwErrorAndExit(`Cannot get integration name from inputs`);
  }
  return integrationName;
}

void deleteIntegrationByNameFromAllRegions();
