import * as core from '@actions/core';
import { ClientSecretCredential } from '@azure/identity';
import { KeyVaultSecret, SecretClient } from '@azure/keyvault-secrets';
import validateIntegration from './integration.validator';

const REGIONS: Readonly<Record<string, string>> = {
  westeurope: 'eu',
  eastus: 'us',
  canadacentral: 'ca',
  australiaeast: 'au',
  germanywestcentral: 'de',
  switzerlandnorth: 'ch'
};

async function run(): Promise<void> {
  const integrationJsonPath: string = core.getInput('integration-json');

  if (!integrationJsonPath) {
    core.setFailed('Please provide a path to the integration JSON file');
    process.exit(1);
  }
  try {
    validateIntegration(integrationJsonPath);
    await postIntegrationToAllRegions();
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

async function postIntegrationToAllRegions(): Promise<void> {
  for (const [region, regionId] of Object.entries(REGIONS)) {
    const secret = await getDiscoverySecretForRegion(region, regionId);
    core.debug(`Received secret for region ${region}: ${secret.value}`);
  }
}

async function getDiscoverySecretForRegion(region: string, regionId: string): Promise<KeyVaultSecret> {
  const vaultUrl = `https://lx${region}prod.vault.azure.net`;
  const client = new SecretClient(
    vaultUrl,
    new ClientSecretCredential(process.env.ARM_TENANT_ID!, process.env.ARM_CLIENT_ID!, process.env.ARM_CLIENT_SECRET!)
  );
  return await client.getSecret(`vsm-discovery-oauth-secret-${regionId}-svc`);
}

run();
