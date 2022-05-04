import axios from 'axios';

export async function getMtmToken(regionId: string, clientSecret: string): Promise<string> {
  try {
    const token = await axios.post<{ access_token: string }>(`https://${regionId}.leanix.net/services/mtm/v1/oauth2/token`, null, {
      params: {
        // eslint-disable-next-line camelcase
        grant_type: 'client_credentials',
        // eslint-disable-next-line camelcase
        client_id: 'vsm-discovery',
        // eslint-disable-next-line camelcase
        client_secret: clientSecret
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'User-Agent': 'create-vsm-integration-action'
      }
    });
    return token.data.access_token;
  } catch (error) {
    throw new Error(`Error fetching MTM token: ${error}`);
  }
}
