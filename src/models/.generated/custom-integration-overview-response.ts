/* tslint:disable */
/* eslint-disable */
import { IntegrationLink } from './integration-link';
export interface CustomIntegrationOverviewResponse {
  beta?: boolean;
  category: string;
  configFree?: boolean;
  configurable?: boolean;
  connectorTemplateId: string;
  health: 'SUCCESS' | 'FAILED';
  id: string;
  links: Array<IntegrationLink>;
  logo: string;
  provisionedExtension?: boolean;
  status: 'AVAILABLE' | 'CONFIGURED' | 'SCHEDULED';
}
