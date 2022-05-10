/* tslint:disable */
/* eslint-disable */
import { FieldStateRequestDto } from './field-state-request-dto';

/**
 * Model used to save the state of a page in a configuration.
 */
export interface PageStateRequestDto {
  fields: Array<FieldStateRequestDto>;
  id: string;
}
