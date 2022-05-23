import { FieldSchemaRequestDto } from './field-schema-request-dto';

/**
 * Model used to save the definition of a page in an integration.
 */
export interface PageSchemaRequestDto {
  fields: Array<FieldSchemaRequestDto>;
  id: string;
  label: string;
}
