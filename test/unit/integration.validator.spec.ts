import { expect, test } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import IntegrationValidator from '../../src/integration.validator';

test('validate integration', async () => {
  const integrationJson = fs.readJsonSync(path.join(__dirname, '../testdata/integration-test.json'));
  const integrationValidator = new IntegrationValidator();
  expect(() => integrationValidator.validate(integrationJson)).not.toThrow();
});
