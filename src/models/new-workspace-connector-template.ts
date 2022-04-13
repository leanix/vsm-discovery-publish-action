/* tslint:disable */
/* eslint-disable */
import { BindingKey } from './binding-key';
export interface NewWorkspaceConnectorTemplate {
  bindingKey: BindingKey;
  connectorConfiguration: {
};
  connectorUrl?: string;
  description: string;
  documentationUrl?: string;
  executionGroup?: string;
  name: string;
  scope: 'GLOBAL' | 'WORKSPACE';
  secretsConfiguration: {
};
}
