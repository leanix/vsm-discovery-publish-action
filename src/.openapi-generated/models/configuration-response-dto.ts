/* tslint:disable */
/* eslint-disable */
import { PageResponseDto } from './page-response-dto';

/**
 * Model used to return the configuration of an integration.
 */
export interface ConfigurationResponseDto {
  id: string;
  integrationId: string;
  name: string;
  pages: Array<PageResponseDto>;
}
