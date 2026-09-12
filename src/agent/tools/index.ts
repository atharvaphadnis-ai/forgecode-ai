import { ToolRegistry } from '../ToolRegistry';
import { WORKSPACE_TOOLS, TERMINAL_TOOLS, PROJECT_TOOLS, GIT_TOOLS } from './definitions';

export const initializeToolRegistry = (registry: ToolRegistry, workspacePath: string) => {
  // Workspace tools
  registry.register(
    WORKSPACE_TOOLS.read_file as any,
    async (args) => {
      try {
        const content = await window.electronAPI.readFile(args.path as string);
        return { success: true, result: content };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }
  );

  registry.register(
    WORKSPACE_TOOLS.write_file as any,
    async (args) => {
      try {
        await window.electronAPI.writeFile(args.path as string, args.content as string);
        return { success: true, result: 'File written' };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }
  );

  registry.register(
    WORKSPACE_TOOLS.create_file as any,
    async (args) => {
      try {
        await window.electronAPI.createFile(args.path as string, args.content as string);
        return { success: true, result: 'File created' };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }
  );

  registry.register(
    WORKSPACE_TOOLS.create_directory as any,
    async (args) => {
      try {
        await window.electronAPI.createDirectory(args.path as string);
        return { success: true, result: 'Directory created' };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }
  );

  registry.register(
    WORKSPACE_TOOLS.search_files as any,
    async (args) => {
      try {
        const results = await window.electronAPI.searchFiles(workspacePath, args.pattern as string);
        return { success: true, result: results };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }
  );

  // Terminal tools
  registry.register(
    TERMINAL_TOOLS.run_command as any,
    async (args) => {
      try {
        const result = await window.electronAPI.executeCommand('default', args.command as string);
        return { success: true, result };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }
  );

  // Git tools
  registry.register(
    GIT_TOOLS.git_status as any,
    async () => {
      try {
        const result = await window.electronAPI.gitStatus(workspacePath);
        return { success: true, result };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }
  );
};
