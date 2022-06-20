import { ClientSecretCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import { throwErrorAndExit } from '../errors';
import { getMtmToken } from '../client/mtm.client';

export class LeanixRegionClient {
  // Pairs <region, regionId>
  static REGIONS: Readonly<Record<string, string>> = {
    westeurope: 'eu',
    eastus: 'us',
    canadacentral: 'ca',
    australiaeast: 'au',
    germanywestcentral: 'de',
    switzerlandnorth: 'ch'
  };

  async getMtmTokenForRegion(region: string, regionId: string): Promise<string> {
    const clientSecret = await this.getClientSecretForRegion(region, regionId);
    return await getMtmToken(regionId, clientSecret);
  }

  private async getClientSecretForRegion(region: string, regionId: string): Promise<string> {
    const vaultUrl = `https://lx${region}prod.vault.azure.net`;
    const client = new SecretClient(
      vaultUrl,
      new ClientSecretCredential(process.env.ARM_TENANT_ID!, process.env.ARM_CLIENT_ID!, process.env.ARM_CLIENT_SECRET!)
    );
    const secret = await client.getSecret(`vsm-discovery-oauth-secret-${regionId}-svc`);
    if (!secret.value) {
      throwErrorAndExit(`Failed to fetch client secret for region ${region}`);
    }
    return secret.value!;
  }
}
