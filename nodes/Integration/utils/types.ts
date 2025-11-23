// Shared types for Agencii API integration

export interface AgenciiChatResponse {
  id?: string;
  text?: string;
  response?: string;
  chatId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export interface AgenciiCreateChatResponse {
  chatId: string;
  createdAt?: string;
  metadata?: Record<string, unknown>;
}

export interface AgenciiErrorResponse {
  error?: {
    message?: string;
    code?: string;
    details?: unknown;
  };
  message?: string;
}
