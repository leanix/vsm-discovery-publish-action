import * as core from '@actions/core';

import { ClientSecretCredential } from '@azure/identity';
// eslint-disable-next-line import/named
import { KeyVaultSecret, SecretClient } from '@azure/keyvault-secrets';
import fs from 'fs-extra';
import { IntegrationClient } from './client/integration.client';
import { getMtmToken } from './client/mtm.client';
import { IntegrationRequestDto } from './models/integration-request-dto';
import AssetService from './asset.service';
import IntegrationValidator from './validators/integration.validator';

const REGIONS: Readonly<Record<string, string>> = {
  westeurope: 'eu',
  eastus: 'us',
  canadacentral: 'ca',
  australiaeast: 'au',
  germanywestcentral: 'de',
  switzerlandnorth: 'ch'
};

async function run(): Promise<void> {
  const integration = await getValidatedIntegrationRequestDto();
  const assetsFolder = core.getInput('assets-folder');
  const dryRun = core.getInput('dry-run');

  try {
    if (dryRun !== 'true') {
      const assetService = new AssetService();
      assetService.updateAssetsPaths(integration);
      await assetService.postAssetsToVaulestreamsUI(integration.name, assetsFolder);

      await postIntegrationToAllRegions(integration);
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

  if (!integrationJsonPath || integrationJsonPath.length === 0) {
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

async function postIntegrationToAllRegions(integration: IntegrationRequestDto): Promise<void> {
  const integrationClient = new IntegrationClient();

  for (const [region, regionId] of Object.entries(REGIONS)) {
    const secret = await getClientSecretForRegion(region, regionId);
    if (!secret.value) {
      throwErrorAndExit(`Failed to fetch client secret for region ${region}`);
    }

    const token = await getMtmToken(regionId, secret.value!);
    await integrationClient.upsertIntegration(regionId, integration, token);

    core.info(`Integration posted successfully to region ${region}`);
  }
}

async function getClientSecretForRegion(region: string, regionId: string): Promise<KeyVaultSecret> {
  const vaultUrl = `https://lx${region}prod.vault.azure.net`;

  if (!process.env.ARM_TENANT_ID || !process.env.ARM_CLIENT_ID || !process.env.ARM_CLIENT_SECRET) {
    throw new Error(`Please add a step to inject secret store credentials before calling this Action (see leanix/secrets-action@master)`);
  }

  const client = new SecretClient(
    vaultUrl,
    new ClientSecretCredential(process.env.ARM_TENANT_ID, process.env.ARM_CLIENT_ID, process.env.ARM_CLIENT_SECRET)
  );

  return await client.getSecret(`vsm-discovery-oauth-secret-${regionId}-svc`);
}

function throwErrorAndExit(message: string) {
  core.setFailed(message);
  process.exit(1);
}

void run();
