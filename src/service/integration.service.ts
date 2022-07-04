import * as core from '@actions/core';
import fs from 'fs-extra';
import IntegrationClient from '../client/integration.client';
import LeanixRegionService from './leanix-region.service';
import { IntegrationRequestDto } from '../models/integration-request-dto';

export default class IntegrationService {
  private lxRegionService: LeanixRegionService;
  private integrationClient: IntegrationClient;

  private assetFolder?: string;
  private assets: AssetModel[] = [];

  constructor(assetFolder?: string) {
    this.lxRegionService = new LeanixRegionService();
    this.integrationClient = new IntegrationClient();

    if (assetFolder) {
      this.assetFolder = assetFolder;
      const assetsNames = fs.readdirSync(assetFolder);
      for (const assetName of assetsNames) {
        this.assets.push({
          name: assetName,
          payload: this.loadFile(`${assetFolder}/${assetName}`),
          url: ''
        });
      }
    }
  }

  async postIntegrationToAllRegions(integration: IntegrationRequestDto): Promise<void> {
    for (const [region, regionId] of Object.entries(LeanixRegionService.REGIONS)) {
      const token = await this.lxRegionService.getMtmTokenForRegion(region, regionId);
      await this.integrationClient.upsertIntegration(regionId, integration, token);
      core.info(`Integration posted successfully to region ${region}`);
    }
  }

  async postAssetsToAllRegions(integration: IntegrationRequestDto): Promise<void> {
    for (const [region, regionId] of Object.entries(LeanixRegionService.REGIONS)) {
      const token = await this.lxRegionService.getMtmTokenForRegion(region, regionId);

      const integrationId = (await this.integrationClient.getIntegrations(regionId, token)).find((it) => it.name === integration.name)?.id;
      if (integrationId === undefined) {
        throw new Error(`Integration with name '${integration.name}' does not exist.`);
      }

      for (const asset of this.assets) {
        asset.url = (await this.integrationClient.upsertAsset(regionId, integrationId, token, asset.payload)).url;
      }

      this.substituteAssetsNames(integration);
      await this.integrationClient.upsertIntegration(regionId, integration, token);

      core.info(`Assets posted successfully to region ${region}`);
    }
  }

  private loadFile(path: string): string {
    const file = fs.readFileSync(path);
    return file.toString();
  }

  private substituteAssetsNames(integration: IntegrationRequestDto) {
    if (integration.logo !== undefined) {
      integration.logo = this.safeGetAsset(integration.logo).url;
    }

    for (const pageSchema of integration.pageSchemas) {
      for (const fieldSchema of pageSchema.fields) {
        if (fieldSchema.hintBox !== undefined) {
          fieldSchema.hintBox = fieldSchema.hintBox.replace(/!\[.*?\](\(.*?\))/, (assetName) => {
            const asset = this.safeGetAsset(assetName);
            if (asset === undefined) {
              throw new Error(`Asset name '${assetName}' does not exist in asset folder '${this.assetFolder}'.`);
            }
            return asset.url;
          });
        }
      }
    }
  }

  private safeGetAsset(name: string): AssetModel {
    const asset = this.assets.find((it) => it.name === name);
    if (asset === undefined) {
      throw new Error(`Asset name '${name}' does not exist in asset folder '${this.assetFolder}'.`);
    }
    return asset;
  }
}
