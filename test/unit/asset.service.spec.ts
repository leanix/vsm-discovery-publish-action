import fs from 'fs-extra';
import path from 'path';
import AssetService from '../../src/asset.service';
import { IntegrationRequestDto } from '../../src/models/integration-request-dto';

describe('asset path substitution', () => {
  const integration: IntegrationRequestDto = fs.readJsonSync(path.join(__dirname, '../testdata/integration-test.json'));
  const expectedIntegration: IntegrationRequestDto = fs.readJsonSync(path.join(__dirname, '../testdata/integration-test-substituted.json'));
  const assetService = new AssetService();

  it('should replace assets path', () => {
    assetService.updateAssetsPaths(integration);
    expect(integration).toEqual(expectedIntegration);
  });
});
