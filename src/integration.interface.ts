export interface IntegrationLink {
  title: string;
  url: string;
}

export interface IntegrationJson {
  readonly id: string;
  links: IntegrationLink[];
  feature: {
    readonly id: string;
    readonly showInList: string;
  };
  configurable?: boolean;
  configurationSections: [
    {
      name: string;
      items: IntegrationField[];
    }
  ];
  configurationPages?: [
    {
      name: string;
      items: IntegrationField[];
    }
  ];
  extensionStatus?: 'General Availability' | 'Early Access' | 'In Development' | 'Planned' | 'End of Life' | 'Deprecated';
  connectorTemplateName: string;
  connectorId?: string;
  executionGroup?: string;
  customConfirmation?: {
    heading: string;
    message: string;
  };
  logo: string;
  video?: string;
  category: string;
  connectorType: 'pull-connector' | 'externally-executed-connector';
  nameHelpText?: string;
}

export interface IntegrationField {
  id: string;
  type:
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'boolean'
    | 'json'
    | 'string-array'
    | 'code-snippet'
    | 'radio'
    | 'create-technical-user'
    | 'go-to-sync-log';
  label?: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  hint?: string;
  path: string;
  defaultValue?: any;
}

export interface IntegrationCodeSnippetVariable {
  name: string;
  dynamic: boolean;
  type: 'text' | 'string-array';
  required?: boolean;
  helpText?: string;
  inputBound?: boolean;
}

export type IntegrationCodeSnippetField = IntegrationField & {
  variables: IntegrationCodeSnippetVariable[];
};

export interface TranslationJson {
  integrations: Record<
    string,
    {
      name: string;
      description: string;
      helpText?: Record<string, string>;
      configuration: Record<string, any>;
      configurationPages?: Record<string, any>;
      links: Record<string, any>;
    }
  >;
}
