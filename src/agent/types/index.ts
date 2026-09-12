// Agent Engine Types

export interface AgentState {
  status: 'idle' | 'planning' | 'running' | 'paused' | 'completed' | 'failed';
  currentStep: number;
  totalSteps: number;
  lastError?: string;
  context: AgentContext;
}

export interface AgentContext {
  workspaceId: string;
  taskId: string;
  userPrompt: string;
  attachments: Array<{ path: string; type: string }>;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  fileContext: Map<string, string>; // path -> content
  recentToolResults: ToolCallResult[];
  tokenUsage: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface ToolCallResult {
  toolName: string;
  args: Record<string, unknown>;
  result: unknown;
  duration: number;
  success: boolean;
  error?: string;
}

export interface AgentResponse {
  id: string;
  taskId: string;
  content: string;
  toolCalls: ToolCall[];
  reasoning?: string;
  finished: boolean;
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, ToolParameter>;
    required: string[];
  };
}

export interface ToolParameter {
  type: string;
  description: string;
  enum?: string[];
}

export interface ToolExecutionResult {
  success: boolean;
  result?: unknown;
  error?: string;
  duration: number;
}
