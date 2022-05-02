import * as core from '@actions/core';
import { KeyVaultManagementClient, Secret } from '@azure/arm-keyvault';
import { ClientSecretCredential } from '@azure/identity';
import validateIntegration from './integration.validator';

type SecretStoreCredentials = {
  ARM_CLIENT_ID: string;
  ARM_CLIENT_SECRET: string;
  ARM_SUBSCRIPTION_ID: string;
  ARM_TENANT_ID: string;
};

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
  const credentialsInput = core.getInput('credentials');

  if (!integrationJsonPath) {
    core.setFailed('Please provide a path to the integration JSON file');
  }

  if (!credentialsInput) {
    core.setFailed('Please provide secret store credentials');
  }

  const credentials: SecretStoreCredentials = JSON.parse(credentialsInput);
  process.env.AZURE_CLIENT_ID = credentials.ARM_CLIENT_ID;
  process.env.AZURE_CLIENT_SECRET = credentials.ARM_CLIENT_SECRET;
  process.env.AZURE_TENANT_ID = credentials.ARM_TENANT_ID;

  try {
    validateIntegration(integrationJsonPath);
    await postToRegions(credentials);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

async function postToRegions(credentials: SecretStoreCredentials): Promise<void> {
  for (const [region, regionId] of Object.entries(REGIONS)) {
    const token = await getDiscoveryToken(credentials, region, regionId);
    core.setOutput(region, token);
  }
}

async function getDiscoveryToken(credentials: SecretStoreCredentials, region: string, regionId: string): Promise<Secret> {
  const client = new KeyVaultManagementClient(
    new ClientSecretCredential(credentials.ARM_TENANT_ID, credentials.ARM_CLIENT_ID, credentials.ARM_CLIENT_SECRET),
    credentials.ARM_SUBSCRIPTION_ID
  );
  return await client.secrets.get(`keyvault-${region}-aks`, `lx${region}prod`, `vsm-discovery-oauth-secret-${regionId}-svc`);
}

run();
