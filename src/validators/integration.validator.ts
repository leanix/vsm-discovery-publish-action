import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { IntegrationClient } from '../client/integration.client';
import { IntegrationRequestDto } from '../models/integration-request-dto';
import { validateCodeSnippetPlaceholders } from './code-snippet.validator';
import { validateEnabledChildItems, validateFeatureFlagsControlledByFields } from './configuration-field.validator';
import { validateMarkdown } from './markdown.validator';

export default class IntegrationValidator {
  private integrationClient: IntegrationClient;

  constructor() {
    this.integrationClient = new IntegrationClient();
  }

  /**
   * Validates a given integration JSON
   * @param integration The integration JSON
   * @param schema (optional) Schema to validate the integration against
   * @returns A `Promise` indicating if the integration is valid.
   * If it is invalid, a validation error is thrown.
   */
  async validate(integration: IntegrationRequestDto, schema?: Record<string, unknown>): Promise<boolean> {
    const ajv = new Ajv();
    addFormats(ajv, ['uri']);

    const integrationSchema = schema || (await this.integrationClient.fetchIntegrationSchema());

    // eslint-disable-next-line no-console
    console.info('Validating integration against provided schema:', integrationSchema);

    // ensure integration schema is a valid JSONSchema
    const isValid = ajv.validateSchema(integrationSchema);
    if (!isValid || ajv.errors) {
      throw new Error('Integration JSON schema is not valid!');
    }

    // ensure integration is valid according to schema
    const compiledSchema = ajv.compile(integrationSchema);
    const validationResult = compiledSchema(integration);

    if (compiledSchema.errors || !validationResult) {
      throw new Error(
        `Integration JSON '${integration.name}' is not a valid implementation of the schema. Errors:\n${JSON.stringify(
          compiledSchema.errors
        )}`
      );
    }

    const configurationFields = integration.pageSchemas.flatMap((page) => page.fields);

    validateFeatureFlagsControlledByFields(integration.featureFlags.dependsOn || [], configurationFields, integration.name);

    for (const configurationField of configurationFields) {
      validateMarkdown(configurationField, integration.name);

      validateEnabledChildItems(configurationField, configurationFields, integration.name);
      for (const option of configurationField.options || []) {
        validateEnabledChildItems(option, configurationFields, integration.name);
      }

      if (configurationField.type === 'CODE_SNIPPET') {
        validateCodeSnippetPlaceholders(configurationField, configurationFields, integration.name);
      }
    }
    return true;
  }
}
