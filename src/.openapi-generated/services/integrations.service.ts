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

import { IntegrationDto } from '../models/integration-dto';
import { SaveIntegrationDto } from '../models/save-integration-dto';


/**
 * Operations to manipulate integrations
 */
@Injectable({
  providedIn: 'root',
})
export class IntegrationsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation findAll
   */
  static readonly FindAllPath = '/integrations';

  /**
   * List all integrations.
   *
   * Lists all the available integrations of the workspace.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAll()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAll$Response(params?: {
  }): Observable<StrictHttpResponse<Array<IntegrationDto>>> {

    const rb = new RequestBuilder(this.rootUrl, IntegrationsService.FindAllPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<IntegrationDto>>;
      })
    );
  }

  /**
   * List all integrations.
   *
   * Lists all the available integrations of the workspace.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findAll$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAll(params?: {
  }): Observable<Array<IntegrationDto>> {

    return this.findAll$Response(params).pipe(
      map((r: StrictHttpResponse<Array<IntegrationDto>>) => r.body as Array<IntegrationDto>)
    );
  }

  /**
   * Path part for operation save
   */
  static readonly SavePath = '/integrations';

  /**
   * Upsert an integration.
   *
   * Creates of updates an integration
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `save()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  save$Response(params: {
    body: SaveIntegrationDto
  }): Observable<StrictHttpResponse<IntegrationDto>> {

    const rb = new RequestBuilder(this.rootUrl, IntegrationsService.SavePath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<IntegrationDto>;
      })
    );
  }

  /**
   * Upsert an integration.
   *
   * Creates of updates an integration
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `save$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  save(params: {
    body: SaveIntegrationDto
  }): Observable<IntegrationDto> {

    return this.save$Response(params).pipe(
      map((r: StrictHttpResponse<IntegrationDto>) => r.body as IntegrationDto)
    );
  }

  /**
   * Path part for operation findOne
   */
  static readonly FindOnePath = '/integrations/{name}';

  /**
   * Get an integration by name.
   *
   * Returns the integration of the given name.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findOne()` instead.
   *
   * This method doesn't expect any request body.
   */
  findOne$Response(params: {

    /**
     * Name of the integration
     */
    name: string;
  }): Observable<StrictHttpResponse<IntegrationDto>> {

    const rb = new RequestBuilder(this.rootUrl, IntegrationsService.FindOnePath, 'get');
    if (params) {
      rb.path('name', params.name, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<IntegrationDto>;
      })
    );
  }

  /**
   * Get an integration by name.
   *
   * Returns the integration of the given name.
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `findOne$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findOne(params: {

    /**
     * Name of the integration
     */
    name: string;
  }): Observable<IntegrationDto> {

    return this.findOne$Response(params).pipe(
      map((r: StrictHttpResponse<IntegrationDto>) => r.body as IntegrationDto)
    );
  }

}
