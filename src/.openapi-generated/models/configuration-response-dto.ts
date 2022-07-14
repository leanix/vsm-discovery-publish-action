/* tslint:disable */
/* eslint-disable */
import { ConfigurationStatusDetails } from './configuration-status-details';
import { PageResponseDto } from './page-response-dto';

/**
 * Model used to return the configuration of an integration.
 */
export interface ConfigurationResponseDto {
  id: string;
  integrationId: string;
  name: string;
  pages: Array<PageResponseDto>;
  status: 'VALID' | 'INVALID' | 'UNKNOWN';
  statusDetails?: Array<ConfigurationStatusDetails>;
}
