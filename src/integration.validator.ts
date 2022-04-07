import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs-extra';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';
import path from 'path';
import { Integration, IntegrationConfigurationField } from './integration.interface';

// TODO check code snippet variables when defined in schema
export default function validateIntegration(integrationId: string, integrationJsonPath: string): void {
  const ajv = new Ajv();
  addFormats(ajv, ['uri']);

  const schemaPath = path.join(__dirname, 'integration.schema.json');
  const schema: Record<string, unknown> = fs.readJsonSync(schemaPath);

  const integrationJson: Integration = fs.readJsonSync(integrationJsonPath);

  // ensure integration.schema.json is a valid JSONSchema
  const validate = ajv.validateSchema(schema);
  if (!validate || ajv.errors) {
    throw new Error('Integration JSON schema is not valid');
  }

  // ensure integration is valid according to schema
  const compiledSchema = ajv.compile(schema);
  const validationResult = compiledSchema(integrationJson);

  if (compiledSchema.errors || !validationResult) {
    throw new Error(`Integration JSON ${integrationId} is not a valid implementation of the schema`);
  }

  const configurationFields = integrationJson.pages.flatMap((page) => page.fields);
  for (const configurationField of configurationFields) {
    assertHasValidMarkdown(configurationField, integrationId);
    configurationField.options?.forEach((option) => {
      const invalidChildFields = option.enables?.filter((childItemId) => !configurationFields.find((field) => field.id === childItemId));
      invalidChildFields?.forEach((childItemId) => {
        throw new Error(`[${integrationId}] Specified chield field of ${option.id} with id ${childItemId} does not exist`);
      });
    });
  }
}

function assertHasValidMarkdown(integrationField: IntegrationConfigurationField, integrationName: string) {
  const { document } = new JSDOM(`...`).window;
  const markdownKeys: (keyof IntegrationConfigurationField)[] = ['hintBox', 'snippet'];

  markdownKeys.forEach((markdownKey, index) => {
    const markdown = integrationField[markdownKey];
    if (!markdown) {
      return;
    }

    const markdownAsHtml = marked.parse(markdown, {});

    document.body.innerHTML = markdownAsHtml;
    console.debug(`[${integrationName}] Rendered HTML for ${integrationField.id}:\n`, document.body.innerHTML);

    if (!markdownAsHtml) {
      throw new Error(`[${integrationName}] Markdown of field ${integrationField.id} cannot be parsed as valid HTML`);
    }

    // the image path depends on nexus structure, might need to be adjusted
    Array.from(document.querySelectorAll('img')).forEach((image) => {
      if (!image.src.includes('images/') || !image.alt) {
        throw new Error(
          `[${integrationName}] Image with source path ${image.src} in field ${integrationField.id} has invalid source path or missing alt text`
        );
      }
    });

    Array.from(document.querySelectorAll('a')).forEach((link) => {
      if (!link.href.startsWith('https://')) {
        throw new Error(`[${integrationName}] Link with href ${link.href} in field ${integrationField.id} does not start with https://`);
      }
    });

    if (index === 0 && !document.body.firstElementChild!.tagName.startsWith('H')) {
      throw new Error(`[${integrationName}] Hint text markdown for ${integrationField.id} does not start with a heading`);
    }
  });
}
