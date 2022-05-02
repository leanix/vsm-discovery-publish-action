/* tslint:disable */
/* eslint-disable */
import { ConfigurationPageEntity } from './configuration-page-entity';
export interface ConfigurationDto {
  id: string;
  integrationId: string;
  name: string;
  pages: Array<ConfigurationPageEntity>;
  workspaceId: string;
}
