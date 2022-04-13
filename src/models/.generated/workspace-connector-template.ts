/* tslint:disable */
/* eslint-disable */
import { BindingKey } from './binding-key';
export interface WorkspaceConnectorTemplate {
  bindingKey: BindingKey;
  connectorConfiguration: {
};
  connectorUrl?: string;
  description: string;
  documentationUrl?: string;
  executionGroup?: string;
  id: string;
  name: string;
  scope: 'GLOBAL' | 'WORKSPACE';
  secretsConfiguration: {
};
}
