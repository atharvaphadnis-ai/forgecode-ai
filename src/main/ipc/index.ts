import { ipcMain, BrowserWindow } from 'electron';
import { FilesystemHandler } from './filesystem';
import { TerminalHandler } from './terminal';
import { SettingsHandler } from './settings';
import { CredentialsHandler } from './credentials';
import { GitHandler } from './git';
import { SearchHandler } from './search';

let filesystemHandler: FilesystemHandler;
let terminalHandler: TerminalHandler;
let settingsHandler: SettingsHandler;
let credentialsHandler: CredentialsHandler;
let gitHandler: GitHandler;
let searchHandler: SearchHandler;

export const setupIPC = (mainWindow: BrowserWindow) => {
  filesystemHandler = new FilesystemHandler();
  terminalHandler = new TerminalHandler();
  settingsHandler = new SettingsHandler();
  credentialsHandler = new CredentialsHandler();
  gitHandler = new GitHandler();
  searchHandler = new SearchHandler();

  // Workspace
  ipcMain.handle('workspace:select', async () => {
    return await filesystemHandler.selectWorkspace(mainWindow);
  });

  ipcMain.handle('workspace:structure', async (_event, path: string) => {
    return await filesystemHandler.getWorkspaceStructure(path);
  });

  // Files
  ipcMain.handle('file:read', async (_event, path: string) => {
    return await filesystemHandler.readFile(path);
  });

  ipcMain.handle('file:write', async (_event, { path, content }: { path: string; content: string }) => {
    return await filesystemHandler.writeFile(path, content);
  });

  ipcMain.handle('file:create', async (_event, { path, content }: { path: string; content?: string }) => {
    return await filesystemHandler.createFile(path, content);
  });

  ipcMain.handle('file:delete', async (_event, path: string) => {
    return await filesystemHandler.deleteFile(path);
  });

  ipcMain.handle('file:rename', async (_event, { path, newPath }: { path: string; newPath: string }) => {
    return await filesystemHandler.renameFile(path, newPath);
  });

  ipcMain.handle('file:move', async (_event, { path, newPath }: { path: string; newPath: string }) => {
    return await filesystemHandler.moveFile(path, newPath);
  });

  // Directories
  ipcMain.handle('directory:create', async (_event, path: string) => {
    return await filesystemHandler.createDirectory(path);
  });

  ipcMain.handle('directory:delete', async (_event, { path, recursive }: { path: string; recursive?: boolean }) => {
    return await filesystemHandler.deleteDirectory(path, recursive);
  });

  // Terminal
  ipcMain.handle('terminal:create', async (_event, { workspaceId, shell }: { workspaceId: string; shell?: string }) => {
    return await terminalHandler.createTerminal(workspaceId, shell);
  });

  ipcMain.handle('terminal:execute', async (_event, { terminalId, command }: { terminalId: string; command: string }) => {
    return await terminalHandler.executeCommand(terminalId, command);
  });

  ipcMain.handle('terminal:kill', async (_event, terminalId: string) => {
    return await terminalHandler.killTerminal(terminalId);
  });

  // Search
  ipcMain.handle('search:files', async (_event, { workspaceId, pattern }: { workspaceId: string; pattern: string }) => {
    return await searchHandler.searchFiles(workspaceId, pattern);
  });

  ipcMain.handle('search:content', async (_event, { workspaceId, pattern }: { workspaceId: string; pattern: string }) => {
    return await searchHandler.searchContent(workspaceId, pattern);
  });

  // Git
  ipcMain.handle('git:status', async (_event, path: string) => {
    return await gitHandler.getStatus(path);
  });

  ipcMain.handle('git:diff', async (_event, path: string) => {
    return await gitHandler.getDiff(path);
  });

  ipcMain.handle('git:commit', async (_event, { path, message }: { path: string; message: string }) => {
    return await gitHandler.commit(path, message);
  });

  // Settings
  ipcMain.handle('settings:get', async () => {
    return await settingsHandler.getSettings();
  });

  ipcMain.handle('settings:save', async (_event, settings: any) => {
    return await settingsHandler.saveSettings(settings);
  });

  // Credentials
  ipcMain.handle('credentials:set', async (_event, { key, value }: { key: string; value: string }) => {
    return await credentialsHandler.setCredential(key, value);
  });

  ipcMain.handle('credentials:get', async (_event, key: string) => {
    return await credentialsHandler.getCredential(key);
  });

  ipcMain.handle('credentials:delete', async (_event, key: string) => {
    return await credentialsHandler.deleteCredential(key);
  });
};
