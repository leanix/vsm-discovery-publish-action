import { expect, test } from '@jest/globals';
import path from 'path';
import validateIntegration from '../../src/integration.validator';

test('validate integration', async () => {
  const integrationJsonPath = path.join(__dirname, '../testdata/integration-test.json');
  const translationJsonPath = path.join(__dirname, '../testdata/translation-test.json');
  expect(() => {
    validateIntegration('test', integrationJsonPath, translationJsonPath);
  }).not.toThrow();
});
