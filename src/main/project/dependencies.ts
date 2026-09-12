import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface DependencyResult {
  success: boolean;
  message?: string;
  error?: string;
}

export class DependencyManager {
  async installDependencies(workspacePath: string): Promise<DependencyResult> {
    try {
      const packageManager = this.detectPackageManager(workspacePath);
      const installCommand = this.getInstallCommand(packageManager);

      execSync(installCommand, {
        cwd: workspacePath,
        stdio: 'inherit',
      });

      return { success: true, message: `Dependencies installed with ${packageManager}` };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async runBuild(workspacePath: string): Promise<DependencyResult> {
    try {
      const buildCommand = this.getBuildCommand(workspacePath);
      execSync(buildCommand, {
        cwd: workspacePath,
        stdio: 'inherit',
      });

      return { success: true, message: 'Build completed successfully' };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async runTests(workspacePath: string): Promise<DependencyResult> {
    try {
      execSync('npm test', {
        cwd: workspacePath,
        stdio: 'inherit',
      });

      return { success: true, message: 'Tests completed' };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private detectPackageManager(workspacePath: string): string {
    if (fs.existsSync(path.join(workspacePath, 'pnpm-lock.yaml'))) return 'pnpm';
    if (fs.existsSync(path.join(workspacePath, 'yarn.lock'))) return 'yarn';
    if (fs.existsSync(path.join(workspacePath, 'bun.lockb'))) return 'bun';
    return 'npm';
  }

  private getInstallCommand(packageManager: string): string {
    switch (packageManager) {
      case 'pnpm':
        return 'pnpm install';
      case 'yarn':
        return 'yarn install';
      case 'bun':
        return 'bun install';
      default:
        return 'npm install';
    }
  }

  private getBuildCommand(workspacePath: string): string {
    try {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(workspacePath, 'package.json'), 'utf-8')
      );

      if (packageJson.scripts?.build) {
        return 'npm run build';
      }
    } catch (_e) {
      // Continue
    }

    return 'echo "No build script found"';
  }
}
