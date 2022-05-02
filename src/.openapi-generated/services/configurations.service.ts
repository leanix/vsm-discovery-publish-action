/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { ConfigurationDto } from '../models/configuration-dto';
import { SaveConfigurationDto } from '../models/save-configuration-dto';


/**
 * Operations to manipulate configurations of each integrations
 */
@Injectable({
  providedIn: 'root',
})
export class ConfigurationsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation findByIntegrationId
   */
  static readonly FindByIntegrationIdPath = '/integrations/{integrationId}/configurations';

  /**
   * List all configurations for a given integration.
   *
   * Lists all configurations available for a specific integrations of the workspace.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findByIntegrationId()` instead.
   *
   * This method doesn't expect any request body.
   */
  findByIntegrationId$Response(params: {
    integrationId: string;
  }): Observable<StrictHttpResponse<Array<ConfigurationDto>>> {

    const rb = new RequestBuilder(this.rootUrl, ConfigurationsService.FindByIntegrationIdPath, 'get');
    if (params) {
      rb.path('integrationId', params.integrationId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ConfigurationDto>>;
      })
    );
  }

  /**
   * List all configurations for a given integration.
   *
   * Lists all configurations available for a specific integrations of the workspace.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findByIntegrationId$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findByIntegrationId(params: {
    integrationId: string;
  }): Observable<Array<ConfigurationDto>> {

    return this.findByIntegrationId$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ConfigurationDto>>) => r.body as Array<ConfigurationDto>)
    );
  }

  /**
   * Path part for operation save1
   */
  static readonly Save1Path = '/integrations/{integrationId}/configurations';

  /**
   * Upsert an configuration.
   *
   * Creates or updates an configuration for the given integration id
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `save1()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  save1$Response(params: {
    integrationId: string;
    body: SaveConfigurationDto
  }): Observable<StrictHttpResponse<ConfigurationDto>> {

    const rb = new RequestBuilder(this.rootUrl, ConfigurationsService.Save1Path, 'post');
    if (params) {
      rb.path('integrationId', params.integrationId, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ConfigurationDto>;
      })
    );
  }

  /**
   * Upsert an configuration.
   *
   * Creates or updates an configuration for the given integration id
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `save1$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  save1(params: {
    integrationId: string;
    body: SaveConfigurationDto
  }): Observable<ConfigurationDto> {

    return this.save1$Response(params).pipe(
      map((r: StrictHttpResponse<ConfigurationDto>) => r.body as ConfigurationDto)
    );
  }

  /**
   * Path part for operation findById
   */
  static readonly FindByIdPath = '/integrations/{integrationId}/configurations/{configurationId}';

  /**
   * Get a configuration by configuration Id.
   *
   * Returns the configuration with the given id.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findById()` instead.
   *
   * This method doesn't expect any request body.
   */
  findById$Response(params: {
    integrationId: string;
    configurationId: string;
  }): Observable<StrictHttpResponse<ConfigurationDto>> {

    const rb = new RequestBuilder(this.rootUrl, ConfigurationsService.FindByIdPath, 'get');
    if (params) {
      rb.path('integrationId', params.integrationId, {});
      rb.path('configurationId', params.configurationId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ConfigurationDto>;
      })
    );
  }

  /**
   * Get a configuration by configuration Id.
   *
   * Returns the configuration with the given id.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findById(params: {
    integrationId: string;
    configurationId: string;
  }): Observable<ConfigurationDto> {

    return this.findById$Response(params).pipe(
      map((r: StrictHttpResponse<ConfigurationDto>) => r.body as ConfigurationDto)
    );
  }

}
