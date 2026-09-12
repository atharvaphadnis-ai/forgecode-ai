import fs from 'fs/promises';
import path from 'path';
import { dialog, BrowserWindow } from 'electron';
import { FileNode } from '@/shared/types';

const IGNORE_PATTERNS = ['node_modules', '.git', 'dist', 'build', 'target', '.next', '.venv'];

export class FilesystemHandler {
  async selectWorkspace(mainWindow: BrowserWindow): Promise<{ path: string; name: string } | null> {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Select Workspace',
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const workspacePath = result.filePaths[0];
      return {
        path: workspacePath,
        name: path.basename(workspacePath),
      };
    }

    return null;
  }

  async getWorkspaceStructure(workspacePath: string): Promise<FileNode> {
    try {
      return await this.buildFileTree(workspacePath, workspacePath);
    } catch (error) {
      throw new Error(`Failed to read workspace: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async buildFileTree(filePath: string, rootPath: string): Promise<FileNode> {
    const name = path.basename(filePath) || filePath;
    const stats = await fs.stat(filePath);
    const isDirectory = stats.isDirectory();

    const node: FileNode = {
      id: filePath,
      path: filePath,
      name,
      type: isDirectory ? 'directory' : 'file',
    };

    if (isDirectory && !this.shouldIgnore(name)) {
      try {
        const entries = await fs.readdir(filePath);
        node.children = [];

        for (const entry of entries) {
          if (!this.shouldIgnore(entry)) {
            const childPath = path.join(filePath, entry);
            const child = await this.buildFileTree(childPath, rootPath);
            node.children.push(child);
          }
        }

        node.children.sort((a, b) => {
          if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
          return a.name.localeCompare(b.name);
        });
      } catch (_error) {
        // Permission denied or other error
      }
    }

    return node;
  }

  private shouldIgnore(name: string): boolean {
    return IGNORE_PATTERNS.some((pattern) => name.includes(pattern));
  }

  async readFile(filePath: string): Promise<string> {
    try {
      this.validatePath(filePath);
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      this.validatePath(filePath);
      await fs.writeFile(filePath, content, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to write file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createFile(filePath: string, content?: string): Promise<void> {
    try {
      this.validatePath(filePath);
      await fs.writeFile(filePath, content || '', 'utf-8');
    } catch (error) {
      throw new Error(`Failed to create file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      this.validatePath(filePath);
      await fs.unlink(filePath);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async renameFile(filePath: string, newPath: string): Promise<void> {
    try {
      this.validatePath(filePath);
      this.validatePath(newPath);
      await fs.rename(filePath, newPath);
    } catch (error) {
      throw new Error(`Failed to rename file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async moveFile(filePath: string, newPath: string): Promise<void> {
    try {
      this.validatePath(filePath);
      this.validatePath(newPath);
      await fs.rename(filePath, newPath);
    } catch (error) {
      throw new Error(`Failed to move file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createDirectory(dirPath: string): Promise<void> {
    try {
      this.validatePath(dirPath);
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteDirectory(dirPath: string, recursive: boolean = false): Promise<void> {
    try {
      this.validatePath(dirPath);
      if (recursive) {
        await fs.rm(dirPath, { recursive: true, force: true });
      } else {
        await fs.rmdir(dirPath);
      }
    } catch (error) {
      throw new Error(`Failed to delete directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validatePath(filePath: string): void {
    if (!filePath || filePath.includes('..')) {
      throw new Error('Invalid path');
    }
  }
}
