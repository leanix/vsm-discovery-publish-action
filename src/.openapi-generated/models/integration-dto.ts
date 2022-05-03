/* tslint:disable */
/* eslint-disable */
import { FeatureFlags } from './feature-flags';
import { PageEntity } from './page-entity';

/**
 * Model used to manipulate an Integration.
 */
export interface IntegrationDto {
  category: 'API' | 'COLLABORATION' | 'COMPLIANCE' | 'DEVELOPMENT' | 'RUNTIME' | 'CUSTOM';
  configurationNameHelpText?: string;
  description: string;
  docs: string;
  featureFlags: FeatureFlags;
  id: string;
  logo?: string;
  name: string;
  pages: Array<PageEntity>;
}
