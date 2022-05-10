/* tslint:disable */
/* eslint-disable */
import { PageStateRequestDto } from './page-state-request-dto';

/**
 * Model used to save the configuration of an integration.
 */
export interface ConfigurationRequestDto {
  integrationId: string;
  name: string;
  pages: Array<PageStateRequestDto>;
}
