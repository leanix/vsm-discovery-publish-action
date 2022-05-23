/* tslint:disable */
/* eslint-disable */
import { DependentFeatureFlag } from './dependent-feature-flag';
export interface IntegrationFeatureFlags {
  dependsOn?: Array<DependentFeatureFlag>;
  showInList: string;
}
