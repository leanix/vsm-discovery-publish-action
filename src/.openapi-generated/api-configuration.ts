/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';

/**
 * Global configuration
 */
@Injectable({
  providedIn: 'root',
})
export class ApiConfiguration {
  rootUrl: string = 'https://istio-westeurope-prod.leanix.net';
}

/**
 * Parameters for `.forRoot()`
 */
export interface ApiConfigurationParams {
  rootUrl?: string;
}
