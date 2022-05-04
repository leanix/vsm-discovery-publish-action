import * as core from '@actions/core';
import { ClientSecretCredential } from '@azure/identity';
// eslint-disable-next-line import/named
import { KeyVaultSecret, SecretClient } from '@azure/keyvault-secrets';
import fs from 'fs-extra';
import { IntegrationDto } from './.openapi-generated/models/integration-dto';
import validateIntegration from './integration.validator';
import { createIntegration } from './services/create-integration';
import { getMtmToken } from './services/get-mtm-token';

const REGIONS: Readonly<Record<string, string>> = {
  westeurope: 'eu',
  eastus: 'us',
  canadacentral: 'ca',
  australiaeast: 'au',
  germanywestcentral: 'de',
  switzerlandnorth: 'ch'
};

async function run(): Promise<void> {
  const integrationJsonPath = core.getInput('integration-json');
  const skipPostIntegration = core.getInput('skip-post-integration');
  let integration: IntegrationDto;

  if (!integrationJsonPath) {
    throwErrorAndExit('Please provide a path to the integration JSON file');
  }

  try {
    integration = fs.readJsonSync(integrationJsonPath);
  } catch (error) {
    throw new Error(`Could not read integration JSON from path '${integrationJsonPath}'`);
  }

  try {
    validateIntegration(integration);
    core.info('Integration is valid');

    if (skipPostIntegration !== 'true') {
      await postIntegrationToAllRegions(integration);
    }
  } catch (error) {
    if (error instanceof Error) {
      throwErrorAndExit(error.message);
    }
    throwErrorAndExit(`${error}`);
  }
}

async function postIntegrationToAllRegions(integration: IntegrationDto): Promise<void> {
  for (const [region, regionId] of Object.entries(REGIONS)) {
    const secret = await getClientSecretForRegion(region, regionId);
    if (!secret.value) {
      throwErrorAndExit(`Failed to fetch client secret for region ${region}`);
    }

    const token = await getMtmToken(regionId, secret.value!);
    await createIntegration(regionId, integration, token);

    core.info(`Integration created successfully on region ${region}`);
  }
}

async function getClientSecretForRegion(region: string, regionId: string): Promise<KeyVaultSecret> {
  const vaultUrl = `https://lx${region}prod.vault.azure.net`;
  const client = new SecretClient(
    vaultUrl,
    new ClientSecretCredential(process.env.ARM_TENANT_ID!, process.env.ARM_CLIENT_ID!, process.env.ARM_CLIENT_SECRET!)
  );
  return await client.getSecret(`vsm-discovery-oauth-secret-${regionId}-svc`);
}

function throwErrorAndExit(message: string) {
  core.setFailed(message);
  process.exit(1);
}

run();
