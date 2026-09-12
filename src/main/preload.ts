import { contextBridge, ipcRenderer } from 'electron';

const electronAPI = {
  // Workspace
  selectWorkspace: () => ipcRenderer.invoke('workspace:select'),
  getWorkspaceStructure: (path: string) => ipcRenderer.invoke('workspace:structure', path),
  
  // Files
  readFile: (path: string) => ipcRenderer.invoke('file:read', path),
  writeFile: (path: string, content: string) => ipcRenderer.invoke('file:write', { path, content }),
  createFile: (path: string, content?: string) => ipcRenderer.invoke('file:create', { path, content }),
  deleteFile: (path: string) => ipcRenderer.invoke('file:delete', path),
  renameFile: (path: string, newPath: string) => ipcRenderer.invoke('file:rename', { path, newPath }),
  moveFile: (path: string, newPath: string) => ipcRenderer.invoke('file:move', { path, newPath }),
  createDirectory: (path: string) => ipcRenderer.invoke('directory:create', path),
  deleteDirectory: (path: string, recursive?: boolean) => ipcRenderer.invoke('directory:delete', { path, recursive }),
  
  // Terminal
  createTerminal: (workspaceId: string, shell?: string) => ipcRenderer.invoke('terminal:create', { workspaceId, shell }),
  executeCommand: (terminalId: string, command: string) => ipcRenderer.invoke('terminal:execute', { terminalId, command }),
  killTerminal: (terminalId: string) => ipcRenderer.invoke('terminal:kill', terminalId),
  
  // Search
  searchFiles: (workspaceId: string, pattern: string) => ipcRenderer.invoke('search:files', { workspaceId, pattern }),
  searchContent: (workspaceId: string, pattern: string) => ipcRenderer.invoke('search:content', { workspaceId, pattern }),
  
  // Git
  gitStatus: (path: string) => ipcRenderer.invoke('git:status', path),
  gitDiff: (path: string) => ipcRenderer.invoke('git:diff', path),
  gitCommit: (path: string, message: string) => ipcRenderer.invoke('git:commit', { path, message }),
  
  // Settings
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings: any) => ipcRenderer.invoke('settings:save', settings),
  
  // Credentials (stored securely)
  setCredential: (key: string, value: string) => ipcRenderer.invoke('credentials:set', { key, value }),
  getCredential: (key: string) => ipcRenderer.invoke('credentials:get', key),
  deleteCredential: (key: string) => ipcRenderer.invoke('credentials:delete', key),
  
  // Listen for menu events
  onMenuOpenWorkspace: (callback: () => void) => ipcRenderer.on('menu:open-workspace', callback),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

declare global {
  interface Window {
    electronAPI: typeof electronAPI;
  }
}
