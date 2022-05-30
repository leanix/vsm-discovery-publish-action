import { DependentFeatureFlag } from '../.openapi-generated/models/dependent-feature-flag';
import { FieldOptionSchemaEntity } from '../.openapi-generated/models/field-option-schema-entity';
import { FieldSchemaRequestDto } from '../models/field-schema-request-dto';

/**
 * Ensures that fields which control feature flags exist and are of type boolean
 */
export function validateFeatureFlagsControlledByFields(
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
 * Ensures that referenced fields via the `enabled` property exist
 */
export function validateEnabledChildItems(
  item: FieldSchemaRequestDto | FieldOptionSchemaEntity,
  allFields: FieldSchemaRequestDto[],
  integrationId: string
) {
  const invalidChildFields = item.enables?.filter((childItemId) => !allFields.find((field) => field.id === childItemId));

  for (const childItemId of invalidChildFields || []) {
    throw new Error(`[${integrationId}] Specified child field of '${item.id}' with id '${childItemId}' does not exist`);
  }
}
