/* tslint:disable */
/* eslint-disable */
import { IntegrationFeatureFlags } from './integration-feature-flags';
import { PageResponseDto } from './page-response-dto';

/**
 * Model used to return the definition of an integration.
 */
export interface IntegrationResponseDto {
  category: 'API' | 'COLLABORATION' | 'COMPLIANCE' | 'DEVELOPMENT' | 'RUNTIME' | 'CUSTOM';
  description: string;
  docs: string;
  featureFlags: IntegrationFeatureFlags;
  id: string;
  label: string;
  logo?: string;
  name: string;
  pageSchemas: Array<PageResponseDto>;
}
