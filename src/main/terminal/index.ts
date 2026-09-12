import { spawn, ChildProcess } from 'child_process';
import os from 'os';
import path from 'path';
import { DEFAULT_SHELL_WINDOWS, DEFAULT_SHELL_UNIX } from '@/shared/constants';

interface Terminal {
  id: string;
  process: ChildProcess;
  cwd: string;
  shell: string;
  buffer: string;
}

export class TerminalHandler {
  private terminals: Map<string, Terminal> = new Map();

  async createTerminal(workspaceId: string, shell?: string): Promise<{ id: string; shell: string }> {
    const terminalId = `terminal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const selectedShell = shell || this.getDefaultShell();
    const cwd = workspaceId;

    try {
      const shellPath = this.getShellPath(selectedShell);
      const childProcess = spawn(shellPath, [], {
        cwd,
        shell: true,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      const terminal: Terminal = {
        id: terminalId,
        process: childProcess,
        cwd,
        shell: selectedShell,
        buffer: '',
      };

      // Handle output
      childProcess.stdout?.on('data', (data) => {
        terminal.buffer += data.toString();
      });

      childProcess.stderr?.on('data', (data) => {
        terminal.buffer += data.toString();
      });

      childProcess.on('exit', () => {
        this.terminals.delete(terminalId);
      });

      this.terminals.set(terminalId, terminal);

      return { id: terminalId, shell: selectedShell };
    } catch (error) {
      throw new Error(`Failed to create terminal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async executeCommand(
    terminalId: string,
    command: string
  ): Promise<{ stdout: string; stderr: string; exitCode: number | null }> {
    const terminal = this.terminals.get(terminalId);
    if (!terminal) {
      throw new Error('Terminal not found');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Command timeout'));
      }, 60000);

      try {
        terminal.buffer = '';
        terminal.process.stdin?.write(command + '\n');

        // Simple approach: wait for output to stabilize
        setTimeout(() => {
          clearTimeout(timeout);
          resolve({
            stdout: terminal.buffer,
            stderr: '',
            exitCode: 0,
          });
        }, 1000);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  async killTerminal(terminalId: string): Promise<void> {
    const terminal = this.terminals.get(terminalId);
    if (terminal) {
      terminal.process.kill();
      this.terminals.delete(terminalId);
    }
  }

  private getDefaultShell(): string {
    return os.platform() === 'win32' ? DEFAULT_SHELL_WINDOWS : DEFAULT_SHELL_UNIX;
  }

  private getShellPath(shell: string): string {
    if (os.platform() === 'win32') {
      return shell === 'cmd' ? 'cmd.exe' : 'powershell.exe';
    }
    return shell === 'zsh' ? '/bin/zsh' : '/bin/bash';
  }
}
