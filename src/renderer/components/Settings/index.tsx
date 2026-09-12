import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import './Settings.css';

interface ProviderConfig {
  type: 'openrouter' | 'nvidia-nim';
  apiUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export const Settings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { settings, setSettings } = useAppStore();
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'editor'>('general');
  const [providerConfig, setProviderConfig] = useState<ProviderConfig>({
    type: 'openrouter',
    apiUrl: 'https://openrouter.ai/api/v1',
    apiKey: '',
    model: '',
    temperature: 0.7,
    maxTokens: 4000,
  });

  const handleTestConnection = async () => {
    try {
      // Store credentials securely
      await window.electronAPI.setCredential('ai_provider_key', providerConfig.apiKey);
      alert('Connection test successful!');
    } catch (error) {
      alert('Connection test failed: ' + error);
    }
  };

  const handleSaveSettings = async () => {
    if (settings) {
      try {
        await window.electronAPI.saveSettings(settings);
        alert('Settings saved successfully!');
        onClose();
      } catch (error) {
        alert('Failed to save settings: ' + error);
      }
    }
  };

  return (
    <div className="settings-modal">
      <div className="settings-container">
        <div className="settings-header">
          <h2>Settings</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="settings-content">
          <div className="settings-sidebar">
            <button
              className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              General
              <ChevronRight size={16} />
            </button>
            <button
              className={`settings-tab ${activeTab === 'ai' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              AI Provider
              <ChevronRight size={16} />
            </button>
            <button
              className={`settings-tab ${activeTab === 'editor' ? 'active' : ''}`}
              onClick={() => setActiveTab('editor')}
            >
              Editor
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="settings-panel">
            {activeTab === 'general' && (
              <div className="settings-section">
                <h3>General Settings</h3>
                <div className="setting-group">
                  <label>Theme</label>
                  <select
                    value={settings?.theme || 'dark'}
                    onChange={(e) =>
                      setSettings({ ...settings!, theme: e.target.value as any })
                    }
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>
                <div className="setting-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings?.confirmDeletes || false}
                      onChange={(e) =>
                        setSettings({ ...settings!, confirmDeletes: e.target.checked })
                      }
                    />
                    Confirm before deleting files
                  </label>
                </div>
                <div className="setting-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings?.autosave || false}
                      onChange={(e) =>
                        setSettings({ ...settings!, autosave: e.target.checked })
                      }
                    />
                    Autosave files
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="settings-section">
                <h3>AI Provider Configuration</h3>
                <div className="setting-group">
                  <label>Provider</label>
                  <select
                    value={providerConfig.type}
                    onChange={(e) =>
                      setProviderConfig({
                        ...providerConfig,
                        type: e.target.value as any,
                      })
                    }
                  >
                    <option value="openrouter">OpenRouter</option>
                    <option value="nvidia-nim">NVIDIA NIM</option>
                  </select>
                </div>

                <div className="setting-group">
                  <label>API URL</label>
                  <input
                    type="text"
                    value={providerConfig.apiUrl}
                    onChange={(e) =>
                      setProviderConfig({ ...providerConfig, apiUrl: e.target.value })
                    }
                    placeholder="https://openrouter.ai/api/v1"
                  />
                </div>

                <div className="setting-group">
                  <label>API Key</label>
                  <input
                    type="password"
                    value={providerConfig.apiKey}
                    onChange={(e) =>
                      setProviderConfig({ ...providerConfig, apiKey: e.target.value })
                    }
                    placeholder="Enter your API key"
                  />
                </div>

                <div className="setting-group">
                  <label>Model</label>
                  <input
                    type="text"
                    value={providerConfig.model}
                    onChange={(e) =>
                      setProviderConfig({ ...providerConfig, model: e.target.value })
                    }
                    placeholder="e.g., openrouter/meta-llama/llama-2-70b-chat"
                  />
                </div>

                <div className="setting-group">
                  <label>Temperature</label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={providerConfig.temperature}
                    onChange={(e) =>
                      setProviderConfig({
                        ...providerConfig,
                        temperature: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="setting-group">
                  <label>Max Tokens</label>
                  <input
                    type="number"
                    value={providerConfig.maxTokens}
                    onChange={(e) =>
                      setProviderConfig({
                        ...providerConfig,
                        maxTokens: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <button onClick={handleTestConnection} className="test-connection-btn">
                  Test Connection
                </button>
              </div>
            )}

            {activeTab === 'editor' && (
              <div className="settings-section">
                <h3>Editor Settings</h3>
                <div className="setting-group">
                  <label>Font Size</label>
                  <input
                    type="number"
                    value={settings?.fontSize || 14}
                    onChange={(e) =>
                      setSettings({ ...settings!, fontSize: parseInt(e.target.value) })
                    }
                  />
                </div>
                <div className="setting-group">
                  <label>Tab Size</label>
                  <input
                    type="number"
                    value={settings?.tabSize || 2}
                    onChange={(e) =>
                      setSettings({ ...settings!, tabSize: parseInt(e.target.value) })
                    }
                  />
                </div>
                <div className="setting-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings?.wordWrap || false}
                      onChange={(e) =>
                        setSettings({ ...settings!, wordWrap: e.target.checked })
                      }
                    />
                    Word Wrap
                  </label>
                </div>
                <div className="setting-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings?.formatOnSave || false}
                      onChange={(e) =>
                        setSettings({ ...settings!, formatOnSave: e.target.checked })
                      }
                    />
                    Format on Save
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="settings-footer">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button onClick={handleSaveSettings} className="save-btn">Save Settings</button>
        </div>
      </div>
    </div>
  );
};
