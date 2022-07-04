import { JSDOM } from 'jsdom';
import { marked } from 'marked';
import { FieldSchemaRequestDto } from '../models/field-schema-request-dto';

/**
 * Ensures that code snippet & hint box of configuration fields contain valid markdown
 */
export function validateMarkdown(integrationField: FieldSchemaRequestDto, integrationName: string) {
  const { document } = new JSDOM(`...`).window;

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

    for (const image of Array.from(document.querySelectorAll('img'))) {
      if (image.src.includes('/')) {
        throw new Error(
          `[${integrationName}] Image with source path '${image.src}' in field '${integrationField.id}' has invalid source path. Please only enter the name of the file.`
        );
      }

      if (!image.alt) {
        throw new Error(
          `[${integrationName}] Image with source path '${image.src}' in field '${integrationField.id}' has missing alt text`
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

    if (index === 1 && !document.body.firstElementChild!.tagName.startsWith('H')) {
      throw new Error(`[${integrationName}] Hint text markdown for '${integrationField.id}' does not start with a heading`);
    }
  });
}
