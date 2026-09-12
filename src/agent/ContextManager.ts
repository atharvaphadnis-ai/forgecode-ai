import { AgentContext } from './types';

const MAX_CONTEXT_TOKENS = 128 * 1024; // 128k tokens
const AVERAGE_TOKENS_PER_CHAR = 0.25; // Rough estimate

export class ContextManager {
  private context: AgentContext;
  private maxTokens: number;

  constructor(context: AgentContext, maxTokens: number = MAX_CONTEXT_TOKENS) {
    this.context = context;
    this.maxTokens = maxTokens;
  }

  addFileContent(path: string, content: string): void {
    const estimatedTokens = Math.ceil(content.length * AVERAGE_TOKENS_PER_CHAR);
    const currentTokens = this.estimateTotalTokens();

    if (currentTokens + estimatedTokens > this.maxTokens) {
      this.pruneOldContext();
    }

    this.context.fileContext.set(path, content);
  }

  getFileContent(path: string): string | undefined {
    return this.context.fileContext.get(path);
  }

  addConversationMessage(role: 'user' | 'assistant', content: string): void {
    this.context.conversationHistory.push({ role, content });
    this.pruneIfNeeded();
  }

  addToolResult(result: unknown, toolName: string, args: Record<string, unknown>): void {
    this.context.recentToolResults.push({
      toolName,
      args,
      result,
      duration: 0,
      success: true,
    });

    // Keep only recent results
    if (this.context.recentToolResults.length > 10) {
      this.context.recentToolResults.shift();
    }
  }

  getContext(): AgentContext {
    return this.context;
  }

  private estimateTotalTokens(): number {
    let totalTokens = 0;

    // Estimate from files
    for (const content of this.context.fileContext.values()) {
      totalTokens += Math.ceil(content.length * AVERAGE_TOKENS_PER_CHAR);
    }

    // Estimate from conversation
    for (const msg of this.context.conversationHistory) {
      totalTokens += Math.ceil(msg.content.length * AVERAGE_TOKENS_PER_CHAR);
    }

    return totalTokens;
  }

  private pruneIfNeeded(): void {
    const currentTokens = this.estimateTotalTokens();
    if (currentTokens > this.maxTokens * 0.9) {
      this.pruneOldContext();
    }
  }

  private pruneOldContext(): void {
    // Remove oldest files if we're over budget
    const files = Array.from(this.context.fileContext.entries());
    if (files.length > 1) {
      this.context.fileContext.delete(files[0][0]);
    }

    // Keep only recent conversation (last 20 messages)
    if (this.context.conversationHistory.length > 20) {
      this.context.conversationHistory = this.context.conversationHistory.slice(-20);
    }
  }

  getEstimatedTokens(): number {
    return this.estimateTotalTokens();
  }
}
