/* tslint:disable */
/* eslint-disable */
import { FieldOptionEntity } from './field-option-entity';
export interface FieldEntity {
  defaultValue?: {
};
  enables?: Array<string>;
  helpText?: string;
  hintBox?: string;
  id: string;
  label: string;
  options?: Array<FieldOptionEntity>;
  placeholder?: string;
  required?: boolean;
  snippet?: string;
  type: 'BOOLEAN' | 'CODE_SNIPPET' | 'EMAIL' | 'JSON' | 'NUMBER' | 'PASSWORD' | 'RADIO' | 'SCHEDULE' | 'STRING_ARRAY' | 'TEXT';
}
