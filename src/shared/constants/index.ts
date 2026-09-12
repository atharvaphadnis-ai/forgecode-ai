// Workspace
export const DEFAULT_WORKSPACE_IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'target',
  '.venv',
  '__pycache__',
  '.pytest_cache',
  '.cargo',
  'out',
  'bin',
  'obj',
  '.gradle',
  '.maven',
];

// Terminal
export const DEFAULT_SHELL_WINDOWS = 'powershell';
export const DEFAULT_SHELL_UNIX = 'bash';

// Agent
export const DEFAULT_MAX_AGENT_ITERATIONS = 10;
export const DEFAULT_AGENT_TIMEOUT = 5 * 60 * 1000; // 5 minutes
export const DEFAULT_CONTEXT_TOKEN_LIMIT = 128 * 1024; // 128k tokens

// Model
export const DEFAULT_TEMPERATURE = 0.7;
export const DEFAULT_MAX_TOKENS = 4000;
export const DEFAULT_REQUEST_TIMEOUT = 60000; // 60 seconds

// Providers
export const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';
export const NVIDIA_NIM_DEFAULT_API_URL = 'https://integrate.api.nvidia.com/v1';

// Tool Categories
export const SAFE_COMMANDS = ['ls', 'dir', 'pwd', 'git status', 'npm run test'];
export const DANGEROUS_COMMANDS = ['rm', 'rmdir', 'del', 'format', 'git push', 'git force'];

// File Types
export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'html',
  'css',
  'json',
  'python',
  'c',
  'cpp',
  'java',
  'rust',
  'go',
  'markdown',
  'yaml',
  'xml',
  'sql',
  'shell',
  'powershell',
];

export const FILE_ICONS = {
  '.ts': 'file-ts',
  '.tsx': 'file-tsx',
  '.js': 'file-js',
  '.jsx': 'file-jsx',
  '.json': 'file-json',
  '.html': 'file-html',
  '.css': 'file-css',
  '.py': 'file-python',
  '.rs': 'file-rust',
  '.go': 'file-go',
  '.md': 'file-markdown',
  'folder': 'folder',
  'git': 'git-branch',
};

// Settings Storage Keys
export const STORAGE_KEYS = {
  SETTINGS: 'forgecode:settings',
  WORKSPACES: 'forgecode:workspaces',
  MODELS: 'forgecode:models',
  TASK_HISTORY: 'forgecode:task-history',
  THEME: 'forgecode:theme',
};

// Error Codes
export const ERROR_CODES = {
  AUTH_FAILED: 'AUTH_FAILED',
  INVALID_MODEL: 'INVALID_MODEL',
  RATE_LIMITED: 'RATE_LIMITED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  PROVIDER_ERROR: 'PROVIDER_ERROR',
  TIMEOUT: 'TIMEOUT',
  INVALID_PATH: 'INVALID_PATH',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
};
