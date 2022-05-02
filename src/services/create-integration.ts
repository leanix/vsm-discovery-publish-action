import axios from 'axios';
import { SaveIntegrationDto } from './../.openapi-generated/models/save-integration-dto';

export async function createIntegration(integration: SaveIntegrationDto): Promise<void> {
  await axios.post('https://eu.leanix.net/services/vsm-discovery/v1/integrations', integration);
}
