import Store from 'electron-store';
import { AppSettings } from '@/shared/types';

const defaultSettings: AppSettings = {
  theme: 'dark',
  fontSize: 14,
  editorFont: 'Fira Code',
  autosave: true,
  confirmDeletes: true,
  confirmAiChanges: true,
  aiChangeMode: 'review',
  maxAgentIterations: 10,
  permissionMode: 'moderate',
  autoFixErrors: true,
  telemetryEnabled: false,
  crashReportingEnabled: false,
  defaultTerminalShell: process.platform === 'win32' ? 'powershell' : 'bash',
  terminalFontSize: 12,
  tabSize: 2,
  wordWrap: true,
  showMinimap: true,
  showLineNumbers: true,
  formatOnSave: false,
};

export class SettingsHandler {
  private store: Store<any>;

  constructor() {
    this.store = new Store({
      name: 'forgecode-settings',
      defaults: defaultSettings,
    });
  }

  async getSettings(): Promise<AppSettings> {
    try {
      return this.store.store as AppSettings;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return defaultSettings;
    }
  }

  async saveSettings(settings: Partial<AppSettings>): Promise<void> {
    try {
      Object.entries(settings).forEach(([key, value]) => {
        this.store.set(key, value);
      });
    } catch (error) {
      throw new Error(`Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
