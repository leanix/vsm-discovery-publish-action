/* tslint:disable */
/* eslint-disable */
import { ConfigurationPageEntity } from './configuration-page-entity';

/**
 * Model used to save a configuration.
 */
export interface SaveConfigurationDto {
  name: string;
  pages: Array<ConfigurationPageEntity>;
}
