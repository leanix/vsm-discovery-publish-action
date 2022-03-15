import { IntegrationCodeSnippetField, IntegrationField, IntegrationJson, TranslationJson } from './integration.interface';
import Ajv from 'ajv';
import { JSDOM } from 'jsdom';
import addFormats from 'ajv-formats';
import fs from 'fs-extra';
import { marked } from 'marked';
import path from 'path';

export default function validateIntegration(integrationId: string, integrationJsonPath: string, translationJsonPath: string): void {
  const ajv = new Ajv();
  addFormats(ajv, ['uri']);

  const schemaPath = path.join(__dirname, 'integration.schema.json');
  const schema: Record<string, unknown> = fs.readJsonSync(schemaPath);

  const integrationJson: IntegrationJson = fs.readJsonSync(integrationJsonPath);
  const translationJson: TranslationJson = fs.readJsonSync(translationJsonPath);

  // ensures integration.schema.json is a valid JSONSchema
  const validate = ajv.validateSchema(schema);
  if (!validate || ajv.errors) {
    throw new Error('JSON Schema is not valid');
  }

  // ensure integration is valid according to schema
  const compiledSchema = ajv.compile(schema);
  const validationResult = compiledSchema(integrationJson);

  if (compiledSchema.errors || !validationResult) {
    throw new Error('Integration JSON is not a valid implementation of the schema');
  }

  // ensures configurable integration has set "connectorId"
  if (integrationJson.configurationSections.length && !integrationJson.connectorId) {
    throw new Error('`connectorId` cannot be null for configurable integrations');
  }

  // translation available for name and description
  const translationForIntegration = translationJson.integrations[integrationId];
  if (!translationForIntegration) {
    throw new Error(`No translation available for ${integrationId}`);
  }

  if (!translationForIntegration.name || !translationForIntegration.description) {
    throw new Error('Name and Description must have an available translation');
  }

  // translation available for all integration links
  if (!translationForIntegration.links || integrationJson.links.some((link) => !translationForIntegration.links[link.title])) {
    throw new Error('All links must have an available translation');
  }

  // translation available for every field
  const translationFields = Object.keys(translationJson.integrations[integrationId].configuration);
  const fieldIds = integrationJson.configurationSections.flatMap((section) => section.items).map((field) => field.id);
  if (fieldIds.some((id) => !translationFields.includes(id))) {
    throw new Error('All fields must have an available translation');
  }

  // can parse markdown to valid HTML
  const fieldsWithHelp = integrationJson.configurationSections
    .flatMap((section) => section.items)
    .filter((field) => field.helpText)
    .sort();

  // translation available for all required help text lines
  for (const integrationField of fieldsWithHelp) {
    const markdown = translationJson.integrations[integrationId].helpText![integrationField.helpText!];
    assertIsValidMarkdown(markdown, integrationField, integrationJson, true);
  }

  // translation available for each title page
  const translationConfigPages = translationJson.integrations[integrationId].configurationPages || {};
  if (Object.values(translationConfigPages).some((translation) => !translation.title)) {
    throw new Error('All title must have an available translation');
  }

  // translation available for all variables in code snippets
  if (integrationJson.configurationPages?.length) {
    for (const page of integrationJson.configurationPages!) {
      for (const codeSnippetField of page.items.filter((field) => field.type === 'code-snippet')) {
        const codeSnippetTranslation: string =
          translationJson.integrations[integrationId].configurationPages![page.name][codeSnippetField.id].codeSnippet;

        if (!codeSnippetTranslation) {
          throw new Error('All code snippets must have a translation');
        }

        if (
          (codeSnippetField as IntegrationCodeSnippetField).variables.some(
            (variable) => !codeSnippetTranslation.includes(`$${variable.name}`)
          )
        ) {
          throw new Error('All code snippets variables must have a translation');
        }

        assertIsValidMarkdown(codeSnippetTranslation, codeSnippetField, integrationJson);
      }
    }

    // translation available for each dynamic variable
    for (const page of integrationJson.configurationPages!) {
      const codeSnippetFields = page.items.filter(
        (field: IntegrationField) => field.type === 'code-snippet' && (field as IntegrationCodeSnippetField).variables.length
      ) as IntegrationCodeSnippetField[];

      for (const codeSnippetField of codeSnippetFields) {
        if (
          codeSnippetField
            .variables!.filter((variable) => variable.dynamic)
            .some(
              (variable) =>
                !translationJson.integrations[integrationId].configurationPages![page.name][codeSnippetField.id].variables[variable.name]
            )
        ) {
          throw new Error('All dynamic variables must have a translation');
        }
      }
    }
  }
}

function assertIsValidMarkdown(
  markdown: string,
  integrationField: IntegrationField,
  integrationJson: IntegrationJson,
  assertStartWithHeading?: boolean
) {
  const { document } = new JSDOM(`...`).window;
  const markdownAsHtml = marked.parse(markdown, {});

  document.body.innerHTML = markdownAsHtml;
  // eslint-disable-next-line no-console
  console.debug(
    `Rendered HTML for ${integrationField.helpText || integrationField.id} in ${integrationJson.id}:\n`,
    document.body.innerHTML
  );

  if (!markdownAsHtml) {
    throw new Error('Markdown cannot be parsed as valid HTML');
  }

  if (!Array.from(document.querySelectorAll('img')).every((image) => image.src.includes('images/') && !!image.alt)) {
    throw new Error('There are invalid image paths.');
  }

  if (!Array.from(document.querySelectorAll('a')).every((link) => link.href.startsWith('https://'))) {
    throw new Error('There are links which do not start with https://');
  }

  if (assertStartWithHeading && !document.body.firstElementChild!.tagName.startsWith('H')) {
    throw new Error('Markdown do not start with a heading');
  }
}
