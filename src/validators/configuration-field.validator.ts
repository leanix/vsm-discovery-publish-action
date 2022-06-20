import { DependentFeatureFlag } from '../.openapi-generated/models/dependent-feature-flag';
import { FieldOptionSchema } from '../.openapi-generated/models/field-option-schema';
import { FieldSchemaRequestDto } from '../models/field-schema-request-dto';
import { IntegrationRequestDto } from '../models/integration-request-dto';
import { validateCodeSnippetPlaceholders } from './code-snippet.validator';
import { validateMarkdown } from './markdown.validator';

export function validateConfigurationFields(integration: IntegrationRequestDto) {
  const configurationFields = integration.pageSchemas.flatMap((page) => page.fields);

  validateFeatureFlagsControlledByFields(integration.featureFlags.dependsOn || [], configurationFields, integration.name);

  for (const field of configurationFields) {
    validateMarkdown(field, integration.name);

    if (field.id === 'configurationName') {
      throw new Error(`[${integration.name}] Field id 'configurationName' is reserved. Please choose a different id.`);
    }

    if (field.type === 'BOOLEAN' || field.type === 'RADIO') {
      validateEnabledChildItems(field, configurationFields, integration.name);
      for (const option of field.options || []) {
        validateEnabledChildItems(option, configurationFields, integration.name);
      }
    }
    if (field.type === 'CODE_SNIPPET') {
      validateCodeSnippetPlaceholders(field, configurationFields, integration.name);
    }
    if (field.value && !validateDefaultValue(field, integration.name)) {
      throw new Error(
        `[${integration.name}] Default value of field '${field.id}' must match the type ${field.type}. Current default value is '${
          field.value
        }' and is of type '${typeof field.value}'.`
      );
    }
  }
}

/**
 * Ensures that fields which control feature flags exist and are of type boolean
 */
function validateFeatureFlagsControlledByFields(
  dependentFeatureFlags: DependentFeatureFlag[],
  configurationFields: FieldSchemaRequestDto[],
  integrationName: string
) {
  const controlledByFeatureFlags = dependentFeatureFlags.filter((dependentFeatureFlag) => dependentFeatureFlag.controlledBy);

  for (const controlledByFeatureFlag of controlledByFeatureFlags) {
    const field = configurationFields.find((fieldSchema) => fieldSchema.id === controlledByFeatureFlag.controlledBy);

    if (!field) {
      throw new Error(
        `[${integrationName}] The dependent field for '${controlledByFeatureFlag.featureId}' with id '${controlledByFeatureFlag.controlledBy}' does not exist`
      );
    }

    if (field.type !== 'BOOLEAN') {
      throw new Error(
        `[${integrationName}] The dependent field for '${controlledByFeatureFlag.featureId}' with id '${controlledByFeatureFlag.controlledBy}' is of type '${field.type}'. Dependent fields must be of type 'BOOLEAN'.`
      );
    }
  }
}

/**
 * Ensure that default values of specific fields (radio, boolean) are allowed
 */
function validateDefaultValue(field: FieldSchemaRequestDto, integrationName: string) {
  switch (field.type) {
    case 'BOOLEAN':
      return typeof field.value === 'boolean';
    case 'JSON':
      return typeof field.value === 'object';
    case 'NUMBER':
      return typeof field.value === 'number';
    case 'RADIO':
      if (!field.options!.find((option) => option.id === field.value)) {
        throw new Error(
          `[${integrationName}] Radio field '${field.id}' has a default value of '${
            field.value
          }'. This is not an allowed field option. Possible values are: ${field.options!.map((option) => option.id).join(', ')}.`
        );
      }
      return true;
    case 'STRING_ARRAY':
      return Array.isArray(field.value);
    default:
      return true;
  }
}

/**
 * Ensures that referenced fields via the `enabled` property exist
 */
function validateEnabledChildItems(
  item: FieldSchemaRequestDto | FieldOptionSchema,
  allFields: FieldSchemaRequestDto[],
  integrationName: string
) {
  const invalidChildFields = item.enables?.filter((childItemId) => !allFields.find((field) => field.id === childItemId));

  for (const childItemId of invalidChildFields || []) {
    throw new Error(`[${integrationName}] Specified child field of '${item.id}' with id '${childItemId}' does not exist`);
  }
}
