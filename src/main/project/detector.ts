import Store from 'electron-store';

const IGNORE_PATTERNS = ['node_modules', '.git', '.next', 'dist', 'build', 'target'];

export class ProjectDetector {
  async detectProject(workspacePath: string): Promise<any> {
    try {
      const packageJsonPath = `${workspacePath}/package.json`;
      const pyprojectPath = `${workspacePath}/pyproject.toml`;
      const cargoPath = `${workspacePath}/Cargo.toml`;
      const goModPath = `${workspacePath}/go.mod`;
      const pomPath = `${workspacePath}/pom.xml`;
      const cmakePath = `${workspacePath}/CMakeLists.txt`;

      const detectedInfo: any = {
        isNodeProject: false,
        isPythonProject: false,
        isRustProject: false,
        isGoProject: false,
        isJavaProject: false,
        isCppProject: false,
      };

      // Check for Node.js project
      try {
        const fs = require('fs');
        if (fs.existsSync(packageJsonPath)) {
          detectedInfo.isNodeProject = true;
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
          detectedInfo.nodeFramework = this.detectNodeFramework(packageJson);
          detectedInfo.packageManager = this.detectPackageManager(workspacePath);
        }
      } catch (_e) {
        // Continue
      }

      return detectedInfo;
    } catch (error) {
      return { error: String(error) };
    }
  }

  private detectNodeFramework(packageJson: any): string {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    if (deps['react']) return 'React';
    if (deps['vue']) return 'Vue';
    if (deps['@angular/core']) return 'Angular';
    if (deps['next']) return 'Next.js';
    if (deps['nuxt']) return 'Nuxt';
    if (deps['svelte']) return 'Svelte';
    if (deps['express']) return 'Express';
    if (deps['fastify']) return 'Fastify';
    if (deps['nest']) return 'NestJS';
    return 'Node.js';
  }

  private detectPackageManager(workspacePath: string): string {
    const fs = require('fs');
    if (fs.existsSync(`${workspacePath}/pnpm-lock.yaml`)) return 'pnpm';
    if (fs.existsSync(`${workspacePath}/yarn.lock`)) return 'yarn';
    if (fs.existsSync(`${workspacePath}/bun.lockb`)) return 'bun';
    return 'npm';
  }
}
