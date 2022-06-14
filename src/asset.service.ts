import * as exec from '@actions/exec';
import path from 'path';
import { IntegrationRequestDto } from './models/integration-request-dto';

export default class AssetService {
  private VALUESTREAMS_ASSETS_PREFIX_PATH = 'assets/integrations';

  updateAssetsPaths(integration: IntegrationRequestDto) {
    const valuestreamsAssetsPath = `${this.VALUESTREAMS_ASSETS_PREFIX_PATH}/${integration.name.replace(' ', '-')}`;
    if (integration.logo !== undefined) {
      integration.logo = `${valuestreamsAssetsPath}/${integration.logo}`;
    }

    for (const pageSchema of integration.pageSchemas) {
      for (const fieldSchema of pageSchema.fields) {
        if (fieldSchema.hintBox !== undefined) {
          // match every occurrence of markdown images and prefix it with `valuestreamsAssetsPath`
          fieldSchema.hintBox = fieldSchema.hintBox.replace(/!\[.*?\](\(.*?\))/, (match) => {
            const split = match.split('(');
            return `${split[0]}(${valuestreamsAssetsPath}/${split[1]}`;
          });
        }
      }
    }
  }

  async postAssetsToVaulestreamsUI(integrationName: string, assetsFolder: string) {
    const sanitizedIntegrationName = integrationName.replace(' ', '-').toLowerCase();

    if (!process.env.GITHUB_TOKEN) {
      throw new Error(`Please add a step to inject secret store credentials before calling this Action (see leanix/secrets-action@master)`);
    }

    const scriptPath = path.join(__dirname, 'scripts/post-assets-to-valuestreams-ui.sh');

    try {
      await exec.exec(`chmod +x ${scriptPath}`);
      await exec.exec(scriptPath, [sanitizedIntegrationName, assetsFolder]);
    } catch (error) {
      throw new Error(`Could not read assets folder from path '${assetsFolder}'. Error: ${error}`);
    }
  }
}
