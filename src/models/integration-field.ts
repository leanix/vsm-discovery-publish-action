/* tslint:disable */
/* eslint-disable */
export interface IntegrationField {
  defaultValue?: {
};
  helpText?: string;
  hint?: string;
  id: string;
  label?: string;
  path: string;
  placeholder?: string;
  required?: boolean;
  type: 'text' | 'number' | 'email' | 'password' | 'boolean' | 'json' | 'string-array' | 'code-snippet' | 'radio' | 'create-technical-user' | 'go-to-sync-log';
}
