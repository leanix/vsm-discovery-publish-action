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
});
