import { execSync } from 'child_process';

export class GitHandler {
  async getStatus(repoPath: string): Promise<any> {
    try {
      const output = execSync('git status --short', { cwd: repoPath, encoding: 'utf-8' });
      return {
        success: true,
        status: output,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getDiff(repoPath: string): Promise<any> {
    try {
      const output = execSync('git diff', { cwd: repoPath, encoding: 'utf-8' });
      return {
        success: true,
        diff: output,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async commit(repoPath: string, message: string): Promise<any> {
    try {
      execSync('git add .', { cwd: repoPath });
      const output = execSync(`git commit -m "${message}"`, { cwd: repoPath, encoding: 'utf-8' });
      return {
        success: true,
        output,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
