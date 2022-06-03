import { expect } from '@jest/globals';
import fs from 'fs-extra';
import { cloneDeep } from 'lodash';
import path from 'path';
import { IntegrationRequestDto } from '../../src/models/integration-request-dto';
import IntegrationValidator from '../../src/validators/integration.validator';

describe('integration validation', () => {
  const integrationJson: IntegrationRequestDto = fs.readJsonSync(path.join(__dirname, '../testdata/integration-test.json'));
  const integrationSchema = fs.readJsonSync(path.join(__dirname, '../testdata/integration.schema.json'));
  const integrationValidator = new IntegrationValidator();

  it('should accept a valid integration', async () => {
    await expect(integrationValidator.validate(integrationJson, integrationSchema)).resolves.toEqual(true);
  });

  it('should show an error for invalid code snippets', async () => {
    const invalidIntegration = cloneDeep(integrationJson);
    invalidIntegration.pageSchemas[0].fields.push({
      id: 'snippet',
      type: 'CODE_SNIPPET',
      label: 'snippet',
      snippet: 'field3: $idonotexist, workspaceId: $workspaceId'
    });
    await expect(integrationValidator.validate(invalidIntegration, integrationSchema)).rejects.toBeDefined();
  });

  describe('fields', () => {
    describe('field ids', () => {
      it('should show an error when using id "configurationName" for a field', async () => {
        const invalidIntegration = cloneDeep(integrationJson);
        invalidIntegration.pageSchemas[0].fields.push({
          id: 'configurationName',
          type: 'TEXT',
          label: 'invalid_boolean',
          value: true
        });
        await expect(integrationValidator.validate(invalidIntegration, integrationSchema)).rejects.toThrowError(
          'Please choose a different id'
        );
      });
    });
    describe('default values', () => {
      it('should show an error for invalid default values of boolean fields', async () => {
        const invalidIntegration = cloneDeep(integrationJson);
        invalidIntegration.pageSchemas[0].fields.push({
          id: 'invalid_boolean',
          type: 'BOOLEAN',
          label: 'invalid_boolean',
          value: 'hi'
        });
        await expect(integrationValidator.validate(invalidIntegration, integrationSchema)).rejects.toThrowError(
          'must match the type BOOLEAN'
        );
      });
      it('should show an error for invalid default values of json fields', async () => {
        const invalidIntegration = cloneDeep(integrationJson);
        invalidIntegration.pageSchemas[0].fields.push({
          id: 'invalid_json',
          type: 'JSON',
          label: 'invalid_json',
          value: 'hi'
        });
        await expect(integrationValidator.validate(invalidIntegration, integrationSchema)).rejects.toThrowError('must match the type JSON');
      });
      it('should show an error for invalid default values of number fields', async () => {
        const invalidIntegration = cloneDeep(integrationJson);
        invalidIntegration.pageSchemas[0].fields.push({
          id: 'invalid_number',
          type: 'NUMBER',
          label: 'invalid_number',
          value: 'hi'
        });
        await expect(integrationValidator.validate(invalidIntegration, integrationSchema)).rejects.toThrowError(
          'must match the type NUMBER'
        );
      });
      it('should show an error for invalid default values of radio fields', async () => {
        const invalidIntegration = cloneDeep(integrationJson);
        invalidIntegration.pageSchemas[0].fields[0].value = 'ups';
        await expect(integrationValidator.validate(invalidIntegration, integrationSchema)).rejects.toThrowError(
          'not an allowed field option'
        );
      });
      it('should show an error for invalid default values of string array fields', async () => {
        const invalidIntegration = cloneDeep(integrationJson);
        invalidIntegration.pageSchemas[0].fields.push({
          id: 'invalid_string_array',
          type: 'STRING_ARRAY',
          label: 'invalid_string_array',
          value: '123'
        });
        await expect(integrationValidator.validate(invalidIntegration, integrationSchema)).rejects.toThrowError(
          'must match the type STRING_ARRAY'
        );
      });
    });
  });
});
