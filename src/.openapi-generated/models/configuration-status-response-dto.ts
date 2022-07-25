/* tslint:disable */
/* eslint-disable */
import { ConfigurationStatusDetails } from './configuration-status-details';
export interface ConfigurationStatusResponseDto {
  configurationId: string;
  status: 'VALID' | 'INVALID' | 'UNKNOWN';
  statusDetails?: Array<ConfigurationStatusDetails>;
}
