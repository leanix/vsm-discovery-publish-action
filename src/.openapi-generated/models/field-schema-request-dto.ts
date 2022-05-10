/* tslint:disable */
/* eslint-disable */
import { FieldOptionSchemaEntity } from './field-option-schema-entity';

/**
 * Model used to save the definition of a field in an integration page.
 */
export interface FieldSchemaRequestDto {
  enables?: Array<string>;
  helpText?: string;
  hintBox?: string;
  id: string;
  label: string;
  options?: Array<FieldOptionSchemaEntity>;
  placeholder?: string;
  required?: boolean;
  snippet?: string;
  type: 'BOOLEAN' | 'CODE_SNIPPET' | 'EMAIL' | 'JSON' | 'NUMBER' | 'PASSWORD' | 'RADIO' | 'SCHEDULE' | 'STRING_ARRAY' | 'TEXT';
  value?: {
};
}
