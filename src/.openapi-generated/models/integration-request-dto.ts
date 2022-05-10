/* tslint:disable */
/* eslint-disable */
import { IntegrationFeatureFlags } from './integration-feature-flags';
import { PageSchemaRequestDto } from './page-schema-request-dto';

/**
 * Model used to save the definition of an integration.
 */
export interface IntegrationRequestDto {
  category: 'API' | 'COLLABORATION' | 'COMPLIANCE' | 'DEVELOPMENT' | 'RUNTIME' | 'CUSTOM';
  description: string;
  docs: string;
  featureFlags: IntegrationFeatureFlags;
  logo?: string;
  name: string;
  pageSchemas: Array<PageSchemaRequestDto>;
}
