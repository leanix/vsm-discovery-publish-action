import axios from 'axios';
import { SaveIntegrationDto } from './../.openapi-generated/models/save-integration-dto';

export async function createIntegration(regionId: string, integration: SaveIntegrationDto, token: string): Promise<void> {
  await axios.post(`https://${regionId}.leanix.net/services/vsm-discovery/v1/integrations`, integration, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
