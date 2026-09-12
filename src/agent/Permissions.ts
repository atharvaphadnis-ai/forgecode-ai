import {
  SAFE_COMMANDS,
  DANGEROUS_COMMANDS,
  DEFAULT_SHELL_WINDOWS,
  DEFAULT_SHELL_UNIX,
} from '@/shared/constants';

export interface PermissionLevel {
  level: 'safe' | 'moderate' | 'dangerous';
  description: string;
  requiresConfirmation: boolean;
}

export class PermissionManager {
  private permissionsCache: Map<string, boolean> = new Map();
  private mode: 'strict' | 'moderate' | 'permissive' = 'moderate';
  private sessionPermissions: Map<string, boolean> = new Map();

  constructor(mode: 'strict' | 'moderate' | 'permissive' = 'moderate') {
    this.mode = mode;
  }

  setMode(mode: 'strict' | 'moderate' | 'permissive'): void {
    this.mode = mode;
  }

  grantPermission(command: string, persistent: boolean = false): void {
    if (persistent) {
      this.permissionsCache.set(command, true);
    } else {
      this.sessionPermissions.set(command, true);
    }
  }

  revokePermission(command: string): void {
    this.permissionsCache.delete(command);
    this.sessionPermissions.delete(command);
  }

  canExecute(command: string): { allowed: boolean; level: PermissionLevel } {
    // Check if already granted
    if (this.permissionsCache.has(command) || this.sessionPermissions.has(command)) {
      return {
        allowed: true,
        level: { level: 'safe', description: 'Permitted', requiresConfirmation: false },
      };
    }

    const level = this.classifyCommand(command);

    switch (this.mode) {
      case 'permissive':
        return { allowed: true, level };
      case 'moderate':
        return {
          allowed: level.level !== 'dangerous',
          level,
        };
      case 'strict':
        return {
          allowed: level.level === 'safe',
          level,
        };
    }
  }

  private classifyCommand(command: string): PermissionLevel {
    const normalized = command.toLowerCase().trim();

    // Check dangerous commands
    for (const dangerous of DANGEROUS_COMMANDS) {
      if (normalized.includes(dangerous)) {
        return {
          level: 'dangerous',
          description: `Dangerous operation: ${dangerous}`,
          requiresConfirmation: true,
        };
      }
    }

    // Check safe commands
    for (const safe of SAFE_COMMANDS) {
      if (normalized.startsWith(safe)) {
        return {
          level: 'safe',
          description: 'Safe read-only operation',
          requiresConfirmation: false,
        };
      }
    }

    // Default to moderate for unknown commands
    return {
      level: 'moderate',
      description: 'Requires permission',
      requiresConfirmation: true,
    };
  }

  validatePath(path: string, workspaceRoot: string): { valid: boolean; error?: string } {
    try {
      const normalizedPath = path.replace(/\\/g, '/');
      const normalizedRoot = workspaceRoot.replace(/\\/g, '/');

      // Prevent path traversal
      if (normalizedPath.includes('../') || normalizedPath.includes('..\\')) {
        return { valid: false, error: 'Path traversal not allowed' };
      }

      // Ensure path is within workspace
      if (!normalizedPath.startsWith(normalizedRoot)) {
        return { valid: false, error: 'Path must be within workspace' };
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, error: 'Invalid path' };
    }
  }

  clearSessionPermissions(): void {
    this.sessionPermissions.clear();
  }
}
