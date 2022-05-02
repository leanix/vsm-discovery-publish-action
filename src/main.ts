import * as core from '@actions/core';
// eslint-disable-next-line import/named
import { KeyVaultManagementClient, Secret } from '@azure/arm-keyvault';
import { ClientSecretCredential } from '@azure/identity';
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
    await postToRegions();
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

async function postToRegions(): Promise<void> {
  for (const [region, regionId] of Object.entries(REGIONS)) {
    const token = await getDiscoveryToken(region, regionId);
    core.debug(`Received token for region ${region}: ${token}`);
  }
}

async function getDiscoveryToken(region: string, regionId: string): Promise<Secret> {
  const client = new KeyVaultManagementClient(
    new ClientSecretCredential(process.env.ARM_TENANT_ID!, process.env.ARM_CLIENT_ID!, process.env.ARM_CLIENT_SECRET!),
    process.env.ARM_SUBSCRIPTION_ID!
  );
  return await client.secrets.get(`keyvault-${region}-aks`, `lx${region}prod`, `vsm-discovery-oauth-secret-${regionId}-svc`);
}

run();
