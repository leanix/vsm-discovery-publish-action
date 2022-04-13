/* tslint:disable */
/* eslint-disable */
import { BindingKey } from './binding-key';
import { SchedulingConfiguration } from './scheduling-configuration';
export interface Datasource {
  bindingKey: BindingKey;
  connectorConfiguration: {
};
  connectorId: string;
  description?: string;
  executionGroup?: string;
  id: string;
  name: string;
  scheduling?: SchedulingConfiguration;
  secretsConfiguration: {
};
}
