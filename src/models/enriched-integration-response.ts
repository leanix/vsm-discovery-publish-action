/* tslint:disable */
/* eslint-disable */
import { IntegrationConfiguration } from './integration-configuration';
import { IntegrationConfigurationSection } from './integration-configuration-section';
import { IntegrationLink } from './integration-link';
import { IntegrationSetupConfirmation } from './integration-setup-confirmation';
import { SchedulingConfiguration } from './scheduling-configuration';
export interface EnrichedIntegrationResponse {
  configurationPages?: Array<IntegrationConfigurationSection>;
  configurationSections: Array<IntegrationConfigurationSection>;
  connectorType: 'pull-connector' | 'externally-executed-connector';
  customConfirmation?: IntegrationSetupConfirmation;
  datasourceId?: string;
  executionGroup?: string;
  id: string;
  lastStatus?: 'CREATED' | 'CONNECTOR_STARTED' | 'CONNECTOR_IN_PROGRESS' | 'CONNECTOR_FINISHED' | 'INTEGRATION_API_IN_PROGRESS' | 'INTEGRATION_API_FINISHED' | 'INTEGRATION_API_RESULT_URL_READY' | 'OUTBOUND_CONNECTOR_IN_PROGRESS' | 'FINISHED' | 'STOPPED' | 'FAILED';
  lastStatusChange?: string;
  links: Array<IntegrationLink>;
  logo: string;
  name?: string;
  nameHelpText?: string;
  provisionedExtension: boolean;
  scheduling?: SchedulingConfiguration;
  value: IntegrationConfiguration;
  video?: string;
}
