import axios, { AxiosError } from 'axios';
import { SaveIntegrationDto } from './../.openapi-generated/models/save-integration-dto';

export async function createIntegration(regionId: string, integration: SaveIntegrationDto, token: string): Promise<void> {
  try {
    await axios.post(`https://${regionId}.leanix.net/services/vsm-discovery/v1/integrations`, integration, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(`Error posting integration to region ${regionId}: ${axiosError.response?.data}`);
  }
}
