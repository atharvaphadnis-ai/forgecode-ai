import { ProviderManager } from './ProviderManager';
import { ToolRegistry } from './ToolRegistry';
import { ContextManager } from './ContextManager';
import { PermissionManager } from './Permissions';
import { AgentState, AgentContext, AgentResponse } from './types';
import { ProviderConfig } from '@/shared/types';

export class AgentEngine {
  private provider: ProviderManager;
  private toolRegistry: ToolRegistry;
  private contextManager: ContextManager;
  private permissionManager: PermissionManager;
  private state: AgentState;
  private maxIterations: number;
  private currentIteration: number = 0;

  constructor(
    providerConfig: ProviderConfig,
    workspaceId: string,
    taskId: string,
    maxIterations: number = 10
  ) {
    this.provider = new ProviderManager(providerConfig);
    this.toolRegistry = new ToolRegistry();
    this.maxIterations = maxIterations;

    const initialContext: AgentContext = {
      workspaceId,
      taskId,
      userPrompt: '',
      attachments: [],
      conversationHistory: [],
      fileContext: new Map(),
      recentToolResults: [],
      tokenUsage: { inputTokens: 0, outputTokens: 0 },
    };

    this.contextManager = new ContextManager(initialContext);
    this.permissionManager = new PermissionManager('moderate');

    this.state = {
      status: 'idle',
      currentStep: 0,
      totalSteps: 0,
      context: initialContext,
    };
  }

  registerTool(
    name: string,
    description: string,
    parameters: Record<string, unknown>,
    handler: (args: Record<string, unknown>) => Promise<{ success: boolean; result?: unknown; error?: string }>
  ): void {
    this.toolRegistry.register(
      {
        name,
        description,
        parameters: {
          type: 'object',
          properties: parameters as Record<string, { type: string; description: string }>,
          required: Object.keys(parameters),
        },
      },
      handler
    );
  }

  async start(userPrompt: string): Promise<void> {
    this.state.status = 'planning';
    this.state.context.userPrompt = userPrompt;
    this.currentIteration = 0;
  }

  async step(): Promise<{ finished: boolean; response?: AgentResponse }> {
    if (this.state.status !== 'running' && this.state.status !== 'planning') {
      return { finished: true };
    }

    if (this.currentIteration >= this.maxIterations) {
      this.state.status = 'completed';
      return { finished: true };
    }

    this.currentIteration++;
    this.state.currentStep = this.currentIteration;

    try {
      // Get response from provider
      const response = await this.provider.complete(
        this.state.context.conversationHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        this.toolRegistry.getDefinitions().map((def) => ({
          type: 'function',
          function: def,
        }))
      );

      // Parse response and tool calls
      const toolCalls = this.parseToolCalls(response.content);

      // Execute tool calls
      for (const toolCall of toolCalls) {
        const result = await this.toolRegistry.execute(toolCall.name, toolCall.args);
        this.contextManager.addToolResult(result, toolCall.name, toolCall.args);
      }

      // Update conversation history
      this.contextManager.addConversationMessage('assistant', response.content);

      // Update token usage
      this.state.context.tokenUsage.inputTokens += response.inputTokens;
      this.state.context.tokenUsage.outputTokens += response.outputTokens;

      // Check if we should continue
      const shouldContinue = response.finishReason !== 'stop' && toolCalls.length > 0;

      return {
        finished: !shouldContinue,
        response: {
          id: `response-${this.currentIteration}`,
          taskId: this.state.context.taskId,
          content: response.content,
          toolCalls,
          finished: !shouldContinue,
        },
      };
    } catch (error) {
      this.state.status = 'failed';
      this.state.lastError = error instanceof Error ? error.message : 'Unknown error';
      return { finished: true };
    }
  }

  private parseToolCalls(content: string): Array<{ name: string; args: Record<string, unknown> }> {
    // This is a simplified parser - real implementation would handle various formats
    const toolCalls: Array<{ name: string; args: Record<string, unknown> }> = [];

    try {
      // Try to extract JSON tool calls from content
      const jsonMatch = content.match(/\{"tool_calls":\s*\[(.*?)\]\}/s);
      if (jsonMatch) {
        const parsed = JSON.parse(`{"tool_calls": [${jsonMatch[1]}]}`);
        return parsed.tool_calls || [];
      }
    } catch {
      // Continue with empty array
    }

    return toolCalls;
  }

  getState(): AgentState {
    return this.state;
  }

  pause(): void {
    this.state.status = 'paused';
  }

  resume(): void {
    if (this.state.status === 'paused') {
      this.state.status = 'running';
    }
  }

  stop(): void {
    this.state.status = 'completed';
  }

  setPermissionMode(mode: 'strict' | 'moderate' | 'permissive'): void {
    this.permissionManager.setMode(mode);
  }
}
