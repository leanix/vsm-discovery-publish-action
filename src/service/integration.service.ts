import * as core from '@actions/core';
import fs from 'fs-extra';
import IntegrationClient from '../client/integration.client';
import LeanixRegionService from './leanix-region.service';
import { IntegrationRequestDto } from '../models/integration-request-dto';

export default class IntegrationService {
  private lxRegionService: LeanixRegionService;
  private integrationClient: IntegrationClient;

  constructor() {
    this.lxRegionService = new LeanixRegionService();
    this.integrationClient = new IntegrationClient();
  }

  async postIntegrationToAllRegions(integration: IntegrationRequestDto): Promise<void> {
    for (const [region, regionId] of Object.entries(LeanixRegionService.REGIONS)) {
      const token = await this.lxRegionService.getMtmTokenForRegion(region, regionId);
      await this.integrationClient.upsertIntegration(regionId, integration, token);
      core.info(`Integration posted successfully to region ${region}`);
    }
  }

  async postAssetsToAllRegions(integrationName: string, assetFolder: string): Promise<void> {
    for (const [region, regionId] of Object.entries(LeanixRegionService.REGIONS)) {
      const token = await this.lxRegionService.getMtmTokenForRegion(region, regionId);

      const integrationId = (await this.integrationClient.getIntegrations(regionId, token)).find((it) => it.name === integrationName)?.id;
      if (integrationId === undefined) {
        throw new Error(`Integration with name '${integrationName}' does not exist.`);
      }

      const assetsNames = fs.readdirSync(assetFolder);
      for (const assetName of assetsNames) {
        const assetPath = `${assetFolder}/${assetName}`;
        await this.integrationClient.upsertAsset(regionId, integrationId, token, assetPath);
        core.info(`Assets '${assetName}' posted successfully to region ${region}`);
      }

      core.info(`All assets posted successfully to region ${region}`);
    }
  }
}
