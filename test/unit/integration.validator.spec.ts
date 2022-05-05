import { expect, test } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import validateIntegration from '../../src/integration.validator';

test('validate integration', async () => {
  const integrationJson = fs.readJsonSync(path.join(__dirname, '../testdata/integration-test.json'));
  expect(() => validateIntegration(integrationJson)).not.toThrow();
});
