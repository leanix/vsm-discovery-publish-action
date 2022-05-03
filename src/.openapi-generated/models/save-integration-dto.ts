/* tslint:disable */
/* eslint-disable */
import { FeatureFlags } from './feature-flags';
import { PageEntity } from './page-entity';

/**
 * Model used to save an Integration.
 */
export interface SaveIntegrationDto {
  category: 'API' | 'COLLABORATION' | 'COMPLIANCE' | 'DEVELOPMENT' | 'RUNTIME' | 'CUSTOM';
  configurationNameHelpText?: string;
  description: string;
  docs: string;
  featureFlags: FeatureFlags;
  logo?: string;
  name: string;
  pages: Array<PageEntity>;
}
