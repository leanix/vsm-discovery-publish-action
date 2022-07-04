import axios, { AxiosError } from 'axios';
import { IntegrationRequestDto } from '../models/integration-request-dto';
import { IntegrationResponseDto } from '../.openapi-generated/models/integration-response-dto';
import { IntegrationAssetResponseDto } from '../models/integration-asset-response-dto';

export default class IntegrationClient {
  async getIntegrations(regionId: string, token: string): Promise<IntegrationResponseDto[]> {
    try {
      return (
        await axios.get<IntegrationResponseDto[]>(`${this.getBaseUrl(regionId)}/integrations`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ).data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`Error getting integrations from region ${regionId}: ${JSON.stringify(axiosError.response?.data)}`);
    }
  }

  async upsertIntegration(regionId: string, integration: IntegrationRequestDto, token: string): Promise<void> {
    try {
      await axios.post(`${this.getBaseUrl(regionId)}/integrations`, integration, {
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
      await axios.delete(`${this.getBaseUrl(regionId)}/integrations/${integrationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`Error deleting integration from region ${regionId}: ${JSON.stringify(axiosError.response?.data)}`);
    }
  }

  async fetchIntegrationSchema(): Promise<Record<string, unknown>> {
    let response;
    try {
      response = await axios.get<Record<string, unknown>>(`${this.getBaseUrl('eu')}/specs/integrations/integration.schema.json`);
    } catch (error) {
      throw new Error(`Error fetching the integration schema`);
    }
    return response.data;
  }

  async upsertAsset(regionId: string, integrationId: string, token: string, asset: string): Promise<IntegrationAssetResponseDto> {
    const formData = new FormData();
    formData.append('asset', asset);
    try {
      return (
        await axios.post(`${this.getBaseUrl(regionId)}/integrations/${integrationId}/assets`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
      ).data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`Error posting asset to region ${regionId}: ${JSON.stringify(axiosError.response?.data)}`);
    }
  }

  async deleteAsset(regionId: string, integrationId: string, token: string, name: string): Promise<void> {
    try {
      await axios.delete(`${this.getBaseUrl(regionId)}/integrations/${integrationId}/assets`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: { name }
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`Error deleting asset from region ${regionId}: ${JSON.stringify(axiosError.response?.data)}`);
    }
  }

  private getBaseUrl(regionId: string): string {
    return `https://${regionId}.leanix.net/services/vsm-discovery/v1`;
  }
}
