import { FieldSchemaRequestDto } from '../models/field-schema-request-dto';

/**
 * Ensures that placeholders are referencing existing fields or global variables
 */
export function validateCodeSnippetPlaceholders(snippetField: FieldSchemaRequestDto, fields: FieldSchemaRequestDto[]) {
  const globalVariables: Readonly<string[]> = ['workspaceId', 'fqdn'];

  if (!snippetField.snippet) {
    throw new Error(`Code snippet field '${snippetField.id}' does not have any snippet content. Please add it to the 'snippet' property.`);
  }

  // matching all words starting with $
  snippetField.snippet.match(/\$\w+/g)?.forEach((match) => {
    const placeholder = match.slice(1);
    if (!globalVariables.includes(placeholder) && !fields.find((field) => field.id === placeholder)) {
      throw new Error(`Field or global variable '${placeholder}' referenced in code snippet '${snippetField.id}' does not exist`);
    }
  });
}
