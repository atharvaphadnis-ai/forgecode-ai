import fs from 'fs/promises';
import path from 'path';

const IGNORE_PATTERNS = ['node_modules', '.git', 'dist', 'build', 'target', '.next', '.venv'];

export class SearchHandler {
  async searchFiles(workspacePath: string, pattern: string): Promise<string[]> {
    const results: string[] = [];
    await this.searchFilesRecursive(workspacePath, pattern, results);
    return results;
  }

  async searchContent(workspacePath: string, pattern: string): Promise<Array<{ file: string; line: number; content: string }>> {
    const results: Array<{ file: string; line: number; content: string }> = [];
    await this.searchContentRecursive(workspacePath, pattern, results);
    return results;
  }

  private async searchFilesRecursive(dirPath: string, pattern: string, results: string[]): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath);

      for (const entry of entries) {
        if (this.shouldIgnore(entry)) continue;

        const fullPath = path.join(dirPath, entry);
        const stats = await fs.stat(fullPath);

        if (entry.includes(pattern)) {
          results.push(fullPath);
        }

        if (stats.isDirectory()) {
          await this.searchFilesRecursive(fullPath, pattern, results);
        }
      }
    } catch (_error) {
      // Permission denied or other error
    }
  }

  private async searchContentRecursive(
    dirPath: string,
    pattern: string,
    results: Array<{ file: string; line: number; content: string }>
  ): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath);

      for (const entry of entries) {
        if (this.shouldIgnore(entry)) continue;

        const fullPath = path.join(dirPath, entry);
        const stats = await fs.stat(fullPath);

        if (stats.isFile() && !this.isBinaryFile(entry)) {
          try {
            const content = await fs.readFile(fullPath, 'utf-8');
            const lines = content.split('\n');

            lines.forEach((line, index) => {
              if (line.includes(pattern)) {
                results.push({
                  file: fullPath,
                  line: index + 1,
                  content: line,
                });
              }
            });
          } catch (_error) {
            // File read error
          }
        } else if (stats.isDirectory()) {
          await this.searchContentRecursive(fullPath, pattern, results);
        }
      }
    } catch (_error) {
      // Permission denied or other error
    }
  }

  private shouldIgnore(name: string): boolean {
    return IGNORE_PATTERNS.some((pattern) => name.includes(pattern));
  }

  private isBinaryFile(filename: string): boolean {
    const binaryExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.bin', '.exe', '.dll'];
    return binaryExtensions.some((ext) => filename.endsWith(ext));
  }
}
