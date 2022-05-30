import { expect, test } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import IntegrationValidator from '../../src/validators/integration.validator';

test('validate integration', async () => {
  const integrationJson = fs.readJsonSync(path.join(__dirname, '../testdata/integration-test.json'));
  const integrationSchema = fs.readJsonSync(path.join(__dirname, '../testdata/integration.schema.json'));
  const integrationValidator = new IntegrationValidator();
  await expect(integrationValidator.validate(integrationJson, integrationSchema)).resolves.toBeUndefined();
});
