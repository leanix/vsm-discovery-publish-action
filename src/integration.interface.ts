export interface IntegrationFeatureFlags {
  showInList: string;
  dependsOn?: string[];
}

export interface IntegrationConfigurationPage {
  id: string;
  label: string;
  fields: IntegrationConfigurationField[];
}

export interface IntegrationConfigurationField {
  id: string;
  label: string;
  type: 'boolean' | 'code-snippet' | 'email' | 'json' | 'number' | 'password' | 'radio' | 'schedule' | 'string-array' | 'text';
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  helpText?: string;
  hintBox?: string;
  options?: IntegrationConfigurationOption[];
  snippet?: string;
}

export interface IntegrationConfigurationOption {
  id: string;
  label: string;
  value: string | boolean;
  enables?: string[];
}

export interface Integration {
  name: string;
  description: string;
  category: string;
  docs: string;
  featureFlags: IntegrationFeatureFlags;
  pages: IntegrationConfigurationPage[];
  configurationNameHelpText?: string;
  logo?: string;
}
