import keytar from 'keytar';

const SERVICE_NAME = 'forgecode-ai';

export class CredentialsHandler {
  async setCredential(key: string, value: string): Promise<void> {
    try {
      await keytar.setPassword(SERVICE_NAME, key, value);
    } catch (error) {
      // Fallback for systems without keytar support
      console.warn('Failed to store credential securely:', error);
    }
  }

  async getCredential(key: string): Promise<string | null> {
    try {
      return await keytar.getPassword(SERVICE_NAME, key);
    } catch (error) {
      console.warn('Failed to retrieve credential:', error);
      return null;
    }
  }

  async deleteCredential(key: string): Promise<void> {
    try {
      await keytar.deletePassword(SERVICE_NAME, key);
    } catch (error) {
      console.warn('Failed to delete credential:', error);
    }
  }
}
