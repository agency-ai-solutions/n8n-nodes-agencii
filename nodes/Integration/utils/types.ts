// Shared types for Agencii API integration

export interface AgenciiChatResponse {
	id?: string;
	text?: string;
	response?: string;
	chatId?: string;
	usage?: {
		promptTokens?: number;
		completionTokens?: number;
		totalTokens?: number;
	};
	metadata?: Record<string, unknown>;
	model?: string;
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

