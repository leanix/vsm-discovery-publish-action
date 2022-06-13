/* tslint:disable */
/* eslint-disable */

/**
 * Model used to save the state of a field in a configuration page.
 */
export interface FieldStateRequestDto {
  id: string;
  type: 'BOOLEAN' | 'CODE_SNIPPET' | 'EMAIL' | 'JSON' | 'NUMBER' | 'PASSWORD' | 'RADIO' | 'SCHEDULE' | 'STRING_ARRAY' | 'TEXT';
  value?: {};
}
