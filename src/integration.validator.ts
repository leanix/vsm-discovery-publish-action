import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs-extra';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';
import path from 'path';
import { Integration, IntegrationConfigurationField, IntegrationConfigurationOption } from './models/integration.interface';

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
    throw new Error('Integration JSON schema is not valid!');
  }

  // ensure integration is valid according to schema
  const compiledSchema = ajv.compile(schema);
  const validationResult = compiledSchema(integrationJson);

  if (compiledSchema.errors || !validationResult) {
    throw new Error(`Integration JSON '${integrationId}' is not a valid implementation of the schema. Errors:\n${compiledSchema.errors}`);
  }

  const configurationFields = integrationJson.pages.flatMap((page) => page.fields);
  for (const configurationField of configurationFields) {
    assertHasValidMarkdown(configurationField, integrationId);

    validateChildItems(configurationField, configurationFields, integrationId);

    for (const option of configurationField.options || []) {
      validateChildItems(option, configurationFields, integrationId);
    }
  }
}

function assertHasValidMarkdown(integrationField: IntegrationConfigurationField, integrationName: string) {
  const { document } = new JSDOM(`...`).window;
  const markdownKeys: (keyof IntegrationConfigurationField)[] = ['hintBox', 'snippet'];

  // eslint-disable-next-line github/array-foreach
  markdownKeys.forEach((markdownKey, index) => {
    const markdown = integrationField[markdownKey];
    if (!markdown) {
      return;
    }

    const markdownAsHtml = marked.parse(markdown, {});

    document.body.innerHTML = markdownAsHtml;
    console.debug(`[${integrationName}] Rendered HTML for field '${integrationField.id}':\n`, document.body.innerHTML);

    if (!markdownAsHtml) {
      throw new Error(`[${integrationName}] Markdown of field '${integrationField.id}' could not be parsed as valid HTML!`);
    }

    // the image path depends on nexus structure, might need to be adjusted
    for (const image of Array.from(document.querySelectorAll('img'))) {
      if (!image.src.includes('images/') || !image.alt) {
        throw new Error(
          `[${integrationName}] Image with source path '${image.src}' in field '${integrationField.id}' has invalid source path or missing alt text`
        );
      }
    }

    for (const link of Array.from(document.querySelectorAll('a'))) {
      if (!link.href.startsWith('https://')) {
        throw new Error(
          `[${integrationName}] Link with href '${link.href}' in field '${integrationField.id}' does not start with https://`
        );
      }
    }

    if (index === 0 && !document.body.firstElementChild!.tagName.startsWith('H')) {
      throw new Error(`[${integrationName}] Hint text markdown for '${integrationField.id}' does not start with a heading`);
    }
  });
}

function validateChildItems(
  item: IntegrationConfigurationField | IntegrationConfigurationOption,
  allFields: IntegrationConfigurationField[],
  integrationId: string
) {
  const invalidChildFields = item.enables?.filter((childItemId) => !allFields.find((field) => field.id === childItemId));

  for (const childItemId of invalidChildFields || []) {
    throw new Error(`[${integrationId}] Specified chield field of '${item.id}' with id '${childItemId}' does not exist`);
  }
}
