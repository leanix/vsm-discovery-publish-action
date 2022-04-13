/* tslint:disable */
/* eslint-disable */
import { IntegrationConfiguration } from './integration-configuration';
import { SchedulingConfiguration } from './scheduling-configuration';
export interface CreateIntegrationBody {
  datasourceId?: string;
  integrationId: string;
  name: string;
  scheduling?: SchedulingConfiguration;
  value: IntegrationConfiguration;
}
