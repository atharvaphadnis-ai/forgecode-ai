import axios, { AxiosInstance, AxiosError } from 'axios';
import { ProviderConfig, ProviderError } from '@/shared/types';

export interface MessageContent {
  role: 'user' | 'assistant';
  content: string | Array<{ type: string; text?: string; source?: { type: string; data: string } }>;
}

export interface CompletionResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
  finishReason: string;
}

export class ProviderManager {
  private config: ProviderConfig;
  private client: AxiosInstance;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.apiUrl,
      timeout: config.requestTimeout || 60000,
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.post(
        '/chat/completions',
        {
          model: this.config.model,
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 10,
        },
        {
          headers: this.getHeaders(),
        }
      );
      return !!response.data;
    } catch (error) {
      return false;
    }
  }

  async complete(
    messages: MessageContent[],
    tools?: Array<{ type: string; function: unknown }>
  ): Promise<CompletionResponse> {
    try {
      const payload: Record<string, unknown> = {
        model: this.config.model,
        messages: this.normalizeMessages(messages),
        temperature: this.config.temperature ?? 0.7,
        max_tokens: this.config.maxTokens ?? 4000,
      };

      if (tools && tools.length > 0) {
        payload.tools = tools;
        payload.tool_choice = 'auto';
      }

      const response = await this.client.post('/chat/completions', payload, {
        headers: this.getHeaders(),
      });

      const choice = response.data.choices[0];
      const content =
        typeof choice.message.content === 'string'
          ? choice.message.content
          : JSON.stringify(choice.message.content);

      return {
        content,
        inputTokens: response.data.usage?.prompt_tokens || 0,
        outputTokens: response.data.usage?.completion_tokens || 0,
        finishReason: choice.finish_reason,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  private normalizeMessages(
    messages: MessageContent[]
  ): Array<{ role: string; content: unknown }> {
    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  private handleError(error: unknown): ProviderError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;

      switch (status) {
        case 401:
        case 403:
          return {
            code: 'AUTH_FAILED',
            message: 'Authentication failed. Check your API key.',
            statusCode: status,
          };
        case 429:
          return {
            code: 'RATE_LIMITED',
            message: 'Rate limit exceeded. Please wait before retrying.',
            statusCode: 429,
          };
        case 404:
          return {
            code: 'INVALID_MODEL',
            message: 'Model not found. Check your model name.',
            statusCode: 404,
          };
        case 500:
        case 502:
        case 503:
          return {
            code: 'PROVIDER_ERROR',
            message: `Provider error: ${status}`,
            statusCode: status,
          };
        default:
          return {
            code: 'NETWORK_ERROR',
            message: axiosError.message || 'Network error',
            details: axiosError.response?.data,
          };
      }
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
