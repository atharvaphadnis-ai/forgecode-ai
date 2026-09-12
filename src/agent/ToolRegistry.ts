import { ToolDefinition, ToolExecutionResult } from './types';

export type ToolHandler = (args: Record<string, unknown>) => Promise<ToolExecutionResult>;

export interface RegisteredTool {
  definition: ToolDefinition;
  handler: ToolHandler;
}

export class ToolRegistry {
  private tools: Map<string, RegisteredTool> = new Map();

  register(definition: ToolDefinition, handler: ToolHandler): void {
    this.tools.set(definition.name, { definition, handler });
  }

  get(name: string): RegisteredTool | undefined {
    return this.tools.get(name);
  }

  async execute(name: string, args: Record<string, unknown>): Promise<ToolExecutionResult> {
    const tool = this.get(name);
    if (!tool) {
      return {
        success: false,
        error: `Tool '${name}' not found`,
        duration: 0,
      };
    }

    const start = Date.now();
    try {
      const result = await tool.handler(args);
      result.duration = Date.now() - start;
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - start,
      };
    }
  }

  getDefinitions(): ToolDefinition[] {
    return Array.from(this.tools.values()).map((tool) => tool.definition);
  }

  getAll(): RegisteredTool[] {
    return Array.from(this.tools.values());
  }
}
