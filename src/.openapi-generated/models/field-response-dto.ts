/* tslint:disable */
/* eslint-disable */
import { FieldOptionSchema } from './field-option-schema';

/**
 * Model used to return the definition of a field in an integration page.
 */
export interface FieldResponseDto {
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
  value?: {};
}
