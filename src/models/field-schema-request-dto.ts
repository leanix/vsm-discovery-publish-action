import { FieldOptionSchema } from '../.openapi-generated/models/field-option-schema';

/**
 * Model used to save the definition of a field schema in an integration page.
 */
export interface FieldSchemaRequestDto {
  enables?: Array<string>;
  helpText?: string;
  hintBox?: string;
  id: string;
  label: string;
  options?: Array<FieldOptionSchema>;
  placeholder?: string;
  required?: boolean;
  snippet?: string;
  type: 'BOOLEAN' | 'CODE_SNIPPET' | 'EMAIL' | 'JSON' | 'NUMBER' | 'PASSWORD' | 'RADIO' | 'SCHEDULE' | 'STRING_ARRAY' | 'TEXT';
  value?: any;
}
