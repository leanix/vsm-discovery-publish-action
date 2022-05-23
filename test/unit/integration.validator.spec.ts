import { expect, test } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import IntegrationValidator from '../../src/integration.validator';

test('validate integration', () => {
  const integrationJson = fs.readJsonSync(path.join(__dirname, '../testdata/integration-test.json'));
  const integrationSchema = fs.readJsonSync(path.join(__dirname, '../testdata/integration.schema.json'));
  const integrationValidator = new IntegrationValidator();
  expect(async () => await integrationValidator.validate(integrationJson, integrationSchema)).not.toThrow();
});
