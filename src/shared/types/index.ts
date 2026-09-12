// AI Provider Configuration
export interface ProviderConfig {
  id: string;
  name: string;
  type: 'openrouter' | 'nvidia-nim' | 'openai-compatible';
  apiUrl: string;
  apiKey: string; // Stored securely, never in state
  model: string;
  temperature?: number;
  maxTokens?: number;
  contextSize?: number;
  requestTimeout?: number;
  retryCount?: number;
}

// Model Configuration
export interface ModelConfig {
  id: string;
  profileName: string;
  provider: ProviderConfig;
  temperature: number;
  maxTokens: number;
  streaming: boolean;
}

// Workspace
export interface Workspace {
  id: string;
  path: string;
  name: string;
  lastOpened: number;
  projectType?: string;
}

// File System
export interface FileNode {
  id: string;
  path: string;
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  isGitIgnored?: boolean;
  isModified?: boolean;
  isNew?: boolean;
  gitStatus?: 'untracked' | 'modified' | 'added' | 'deleted';
}

// Agent
export interface AgentTask {
  id: string;
  workspaceId: string;
  prompt: string;
  attachments: Attachment[];
  createdAt: number;
  updatedAt: number;
  status: 'idle' | 'planning' | 'running' | 'completed' | 'failed' | 'paused';
  messages: AgentMessage[];
  plan?: AgentPlan;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
}

export interface AgentPlan {
  id: string;
  steps: string[];
  estimatedDuration?: number;
  approved: boolean;
}

// Tool System
export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  timestamp: number;
}

export interface ToolResult {
  id: string;
  toolCallId: string;
  success: boolean;
  result?: unknown;
  error?: string;
  duration: number;
}

// Permissions
export interface PermissionRequest {
  id: string;
  type: 'safe' | 'moderate' | 'dangerous';
  command: string;
  description: string;
  timestamp: number;
}

export interface PermissionDecision {
  id: string;
  approved: boolean;
  persistent: boolean; // Remember for this session or always
}

// Terminal
export interface TerminalSession {
  id: string;
  workspaceId: string;
  name: string;
  shell: 'powershell' | 'cmd' | 'bash' | 'zsh';
  cwd: string;
  isActive: boolean;
}

export interface TerminalCommand {
  id: string;
  sessionId: string;
  command: string;
  timestamp: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  exitCode?: number;
  stdout?: string;
  stderr?: string;
}

// File Changes
export interface FileChange {
  id: string;
  path: string;
  type: 'created' | 'modified' | 'deleted' | 'renamed';
  timestamp: number;
  previousPath?: string; // For renamed
  diff?: Diff;
}

export interface Diff {
  id: string;
  original: string;
  modified: string;
  additions: number;
  deletions: number;
  hunks: DiffHunk[];
}

export interface DiffHunk {
  startLine: number;
  endLine: number;
  originalStartLine: number;
  originalEndLine: number;
  lines: DiffLine[];
}

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  content: string;
  lineNumber?: number;
}

// Diagnostics
export interface Diagnostic {
  id: string;
  file: string;
  line: number;
  column: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  code?: string;
  source?: string;
  fixAvailable?: boolean;
}

// Checkpoints
export interface Checkpoint {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  createdAt: number;
  fileSnapshots: Map<string, string>; // path -> content
}

// Project Info
export interface ProjectInfo {
  language?: string;
  framework?: string;
  packageManager?: 'npm' | 'pnpm' | 'yarn' | 'bun';
  projectType?: string;
  hasGit: boolean;
  dependencies?: Record<string, string>;
}

// Attachments
export interface Attachment {
  id: string;
  type: 'file' | 'image' | 'text';
  path: string;
  displayName: string;
  content?: string; // For small text files
  size: number;
  mimeType: string;
}

// Settings
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  editorFont: string;
  autosave: boolean;
  confirmDeletes: boolean;
  confirmAiChanges: boolean;
  aiChangeMode: 'auto' | 'review' | 'ask';
  maxAgentIterations: number;
  permissionMode: 'strict' | 'moderate' | 'permissive';
  autoFixErrors: boolean;
  telemetryEnabled: boolean;
  crashReportingEnabled: boolean;
  defaultTerminalShell: string;
  terminalFontSize: number;
  tabSize: number;
  wordWrap: boolean;
  showMinimap: boolean;
  showLineNumbers: boolean;
  formatOnSave: boolean;
}

// Provider Errors
export interface ProviderError {
  code: string;
  message: string;
  statusCode?: number;
  details?: unknown;
}
