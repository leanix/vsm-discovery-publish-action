import axios, { AxiosError } from 'axios';
import { IntegrationRequestDto } from '../models/integration-request-dto';
import { IntegrationResponseDto } from '../models/integration-response-dto';

export class IntegrationClient {
  async getIntegrations(regionId: string, token: string): Promise<IntegrationResponseDto[]> {
    try {
      return (
        await axios.get<IntegrationResponseDto[]>(`https://${regionId}.leanix.net/services/vsm-discovery/v1/integrations`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ).data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`Error getting integrations to region ${regionId}: ${JSON.stringify(axiosError.response?.data)}`);
    }
  }

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

  async deleteIntegration(regionId: string, integrationId: string, token: string): Promise<void> {
    try {
      await axios.delete(`https://${regionId}.leanix.net/services/vsm-discovery/v1/integrations/${integrationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`Error deleting integration to region ${regionId}: ${JSON.stringify(axiosError.response?.data)}`);
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
