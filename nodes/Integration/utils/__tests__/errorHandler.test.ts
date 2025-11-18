/**
 * Unit tests for Error Handler utility
 * 
 * Tests verify:
 * - Proper error message extraction from Agencii API responses
 * - Fallback error handling for various error shapes
 * - Response validation
 */

import { handleAgenciiError, validateResponse } from '../errorHandler';
import type { AgenciiErrorResponse } from '../types';

describe('Error Handler Utility', () => {
	describe('handleAgenciiError', () => {
		it('should extract error message from nested error object', () => {
			const error: AgenciiErrorResponse = {
				error: {
					message: 'Invalid API key',
					code: 'AUTH_ERROR',
				},
			};
			
			const result = handleAgenciiError(error);
			expect(result).toBe('Invalid API key');
		});

		it('should extract error message from top-level message', () => {
			const error: AgenciiErrorResponse = {
				message: 'Rate limit exceeded',
			};
			
			const result = handleAgenciiError(error);
			expect(result).toBe('Rate limit exceeded');
		});

		it('should handle Error instances', () => {
			const error = new Error('Network timeout');
			
			const result = handleAgenciiError(error);
			expect(result).toBe('Network timeout');
		});

		it('should return generic message for unknown errors', () => {
			const error = 'Some string error';
			
			const result = handleAgenciiError(error);
			expect(result).toBe('An unknown error occurred while communicating with Agencii API');
		});

		it('should return generic message for null/undefined', () => {
			const result1 = handleAgenciiError(null);
			const result2 = handleAgenciiError(undefined);
			
			expect(result1).toBe('An unknown error occurred while communicating with Agencii API');
			expect(result2).toBe('An unknown error occurred while communicating with Agencii API');
		});

		it('should prioritize nested error message over top-level message', () => {
			const error: AgenciiErrorResponse = {
				error: {
					message: 'Detailed error',
				},
				message: 'Generic error',
			};
			
			const result = handleAgenciiError(error);
			expect(result).toBe('Detailed error');
		});
	});

	describe('validateResponse', () => {
		interface TestResponse {
			chatId: string;
			text: string;
		}

		it('should return true for valid response with all required fields', () => {
			const response = {
				chatId: 'chat-123',
				text: 'Hello world',
			};
			
			const result = validateResponse<TestResponse>(response, ['chatId', 'text']);
			expect(result).toBe(true);
		});

		it('should return false for response missing required fields', () => {
			const response = {
				chatId: 'chat-123',
			};
			
			const result = validateResponse<TestResponse>(response, ['chatId', 'text']);
			expect(result).toBe(false);
		});

		it('should return false for null response', () => {
			const result = validateResponse<TestResponse>(null, ['chatId', 'text']);
			expect(result).toBe(false);
		});

		it('should return false for undefined response', () => {
			const result = validateResponse<TestResponse>(undefined, ['chatId', 'text']);
			expect(result).toBe(false);
		});

		it('should return false for non-object response', () => {
			const result1 = validateResponse<TestResponse>('string', ['chatId', 'text']);
			const result2 = validateResponse<TestResponse>(123, ['chatId', 'text']);
			const result3 = validateResponse<TestResponse>(true, ['chatId', 'text']);
			
			expect(result1).toBe(false);
			expect(result2).toBe(false);
			expect(result3).toBe(false);
		});

		it('should return true for response with extra fields', () => {
			const response = {
				chatId: 'chat-123',
				text: 'Hello world',
				usage: { tokens: 10 },
				metadata: { key: 'value' },
			};
			
			const result = validateResponse<TestResponse>(response, ['chatId', 'text']);
			expect(result).toBe(true);
		});

		it('should return true for empty required fields array', () => {
			const response = {};
			
			const result = validateResponse<TestResponse>(response, []);
			expect(result).toBe(true);
		});

		it('should handle fields with undefined values as present', () => {
			const response = {
				chatId: 'chat-123',
				text: undefined,
			};
			
			// Field is present but value is undefined
			const result = validateResponse<TestResponse>(response, ['chatId', 'text']);
			expect(result).toBe(true);
		});
	});
});

