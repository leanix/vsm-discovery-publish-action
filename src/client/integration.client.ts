import axios, { AxiosError } from 'axios';
import { IntegrationRequestDto } from '../models/integration-request-dto';

export class IntegrationClient {
  async upsertIntegration(regionId: string, integration: IntegrationRequestDto, token: string): Promise<void> {
    try {
      await axios.post(`https://${regionId}.leanix.net/services/vsm-discovery/v1/integrations`, integration, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`Error posting integration to region ${regionId}: ${JSON.stringify(axiosError.response?.data)}`);
    }
  }

  async fetchIntegrationSchema(): Promise<Record<string, unknown>> {
    let response;
    try {
      response = await axios.get<Record<string, unknown>>(
        `https://eu.leanix.net/services/vsm-discovery/v1/specs/integrations/integration.schema.json`
      );
    } catch (error) {
      throw new Error(`Error fetching the integration schema`);
    }
    return response.data;
  }
}
