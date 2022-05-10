/* tslint:disable */
/* eslint-disable */
import { FieldResponseDto } from './field-response-dto';

/**
 * Model used to return the definition of a page in an integration.
 */
export interface PageResponseDto {
  fields: Array<FieldResponseDto>;
  id: string;
  label: string;
}
