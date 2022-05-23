import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs-extra';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';
import path from 'path';
import { FieldOptionSchemaEntity } from './.openapi-generated/models/field-option-schema-entity';
import { FieldSchemaRequestDto } from './models/field-schema-request-dto';
import { IntegrationRequestDto } from './models/integration-request-dto';

export default function validateIntegration(integration: IntegrationRequestDto): void {
  const ajv = new Ajv();
  addFormats(ajv, ['uri']);

  const schemaPath = path.join(__dirname, 'integration.schema.json');
  const schema: Record<string, unknown> = fs.readJsonSync(schemaPath);

  // ensure integration.schema.json is a valid JSONSchema
  const validate = ajv.validateSchema(schema);
  if (!validate || ajv.errors) {
    throw new Error('Integration JSON schema is not valid!');
  }

  // ensure integration is valid according to schema
  const compiledSchema = ajv.compile(schema);
  const validationResult = compiledSchema(integration);

  if (compiledSchema.errors || !validationResult) {
    throw new Error(
      `Integration JSON '${integration.name}' is not a valid implementation of the schema. Errors:\n${JSON.stringify(
        compiledSchema.errors
      )}`
    );
  }

  // ensure configuration fields have valid markdown
  // and only existing fields are referenced via `enabled` property
  const configurationFields = integration.pageSchemas.flatMap((page) => page.fields);
  for (const configurationField of configurationFields) {
    assertHasValidMarkdown(configurationField, integration.name);

    validateChildItems(configurationField, configurationFields, integration.name);

    for (const option of configurationField.options || []) {
      validateChildItems(option, configurationFields, integration.name);
    }
  }

  // TODO validate code snippet variables as soon as they are defined in schema
}

function assertHasValidMarkdown(integrationField: FieldSchemaRequestDto, integrationName: string) {
  const { document } = new JSDOM(`...`).window;

  // eslint-disable-next-line github/array-foreach
  [integrationField.snippet, integrationField.hintBox].forEach((markdown, index) => {
    if (!markdown) {
      return;
    }

    const markdownAsHtml = marked.parse(markdown, {});

    document.body.innerHTML = markdownAsHtml;
    // eslint-disable-next-line no-console
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
  item: FieldSchemaRequestDto | FieldOptionSchemaEntity,
  allFields: FieldSchemaRequestDto[],
  integrationId: string
) {
  const invalidChildFields = item.enables?.filter((childItemId) => !allFields.find((field) => field.id === childItemId));

  for (const childItemId of invalidChildFields || []) {
    throw new Error(`[${integrationId}] Specified chield field of '${item.id}' with id '${childItemId}' does not exist`);
  }
}
