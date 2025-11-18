/**
 * Unit tests for Agencii Chat Resource - Get Response operation
 * 
 * Tests verify:
 * - Correct HTTP method and endpoint
 * - Proper parameter mapping to request payload
 * - Response normalization (chatId and text extraction)
 * - Optional fields handling (model, temperature, maxTokens)
 */

import { chatDescription } from '../index';
import type { INodeProperties } from 'n8n-workflow';

describe('Chat Resource - Get Response', () => {
	let getResponseOperation: INodeProperties | undefined;

	beforeAll(() => {
		// Find the operation definition
		getResponseOperation = chatDescription.find(
			(prop) => prop.name === 'operation'
		);
	});

	describe('Operation Definition', () => {
		it('should define getResponse operation', () => {
			expect(getResponseOperation).toBeDefined();
			expect(getResponseOperation?.type).toBe('options');
			
			const options = (getResponseOperation?.options as any[]) || [];
			const getResponseOption = options.find((opt) => opt.value === 'getResponse');
			
			expect(getResponseOption).toBeDefined();
			expect(getResponseOption?.name).toBe('Get Response');
			expect(getResponseOption?.action).toBe('Generate a completion');
		});

		it('should use POST method', () => {
			const options = (getResponseOperation?.options as any[]) || [];
			const getResponseOption = options.find((opt) => opt.value === 'getResponse');
			
			expect(getResponseOption?.routing?.request?.method).toBe('POST');
		});

		it('should use correct endpoint', () => {
			const options = (getResponseOperation?.options as any[]) || [];
			const getResponseOption = options.find((opt) => opt.value === 'getResponse');
			
			expect(getResponseOption?.routing?.request?.url).toBe('/chat/completions');
		});
	});

	describe('Required Parameters', () => {
		it('should define prompt parameter as required', () => {
			const promptField = chatDescription.find(
				(prop) => prop.name === 'prompt'
			);
			
			expect(promptField).toBeDefined();
			expect(promptField?.required).toBe(true);
			expect(promptField?.type).toBe('string');
		});

		it('should send prompt in request body', () => {
			const promptField = chatDescription.find(
				(prop) => prop.name === 'prompt'
			);
			
			expect(promptField?.routing?.send?.type).toBe('body');
			expect(promptField?.routing?.send?.property).toBe('prompt');
		});
	});

	describe('Optional Parameters', () => {
		it('should define chatId parameter as optional', () => {
			const chatIdField = chatDescription.find(
				(prop) => prop.name === 'chatId'
			);
			
			expect(chatIdField).toBeDefined();
			expect(chatIdField?.required).toBeUndefined();
			expect(chatIdField?.type).toBe('string');
		});

		it('should send chatId in request body when provided', () => {
			const chatIdField = chatDescription.find(
				(prop) => prop.name === 'chatId'
			);
			
			expect(chatIdField?.routing?.send?.type).toBe('body');
			expect(chatIdField?.routing?.send?.property).toBe('chatId');
		});

		it('should define additional fields collection', () => {
			const additionalFields = chatDescription.find(
				(prop) => prop.name === 'additionalFields' && 
				prop.displayOptions?.show?.operation?.[0] === 'getResponse'
			);
			
			expect(additionalFields).toBeDefined();
			expect(additionalFields?.type).toBe('collection');
			
			const options = (additionalFields?.options as any[]) || [];
			expect(options.length).toBeGreaterThan(0);
		});

		it('should include model option in additional fields', () => {
			const additionalFields = chatDescription.find(
				(prop) => prop.name === 'additionalFields' && 
				prop.displayOptions?.show?.operation?.[0] === 'getResponse'
			);
			
			const options = (additionalFields?.options as any[]) || [];
			const modelOption = options.find((opt) => opt.name === 'model');
			
			expect(modelOption).toBeDefined();
			expect(modelOption?.type).toBe('string');
		});

		it('should include temperature option with proper constraints', () => {
			const additionalFields = chatDescription.find(
				(prop) => prop.name === 'additionalFields' && 
				prop.displayOptions?.show?.operation?.[0] === 'getResponse'
			);
			
			const options = (additionalFields?.options as any[]) || [];
			const tempOption = options.find((opt) => opt.name === 'temperature');
			
			expect(tempOption).toBeDefined();
			expect(tempOption?.type).toBe('number');
			expect(tempOption?.typeOptions?.minValue).toBe(0);
			expect(tempOption?.typeOptions?.maxValue).toBe(2);
		});

		it('should include maxTokens option', () => {
			const additionalFields = chatDescription.find(
				(prop) => prop.name === 'additionalFields' && 
				prop.displayOptions?.show?.operation?.[0] === 'getResponse'
			);
			
			const options = (additionalFields?.options as any[]) || [];
			const maxTokensOption = options.find((opt) => opt.name === 'maxTokens');
			
			expect(maxTokensOption).toBeDefined();
			expect(maxTokensOption?.type).toBe('number');
			expect(maxTokensOption?.typeOptions?.minValue).toBe(1);
		});
	});

	describe('Response Normalization', () => {
		it('should define postReceive handler for response normalization', () => {
			const options = (getResponseOperation?.options as any[]) || [];
			const getResponseOption = options.find((opt) => opt.value === 'getResponse');
			
			expect(getResponseOption?.routing?.output?.postReceive).toBeDefined();
			expect(Array.isArray(getResponseOption?.routing?.output?.postReceive)).toBe(true);
			expect(getResponseOption?.routing?.output?.postReceive?.length).toBeGreaterThan(0);
		});

		it('should normalize chatId from various field names', async () => {
			const options = (getResponseOperation?.options as any[]) || [];
			const getResponseOption = options.find((opt) => opt.value === 'getResponse');
			const postReceive = getResponseOption?.routing?.output?.postReceive?.[0];
			
			// Mock items with different chatId field names
			const testCases = [
				{ json: { chatId: 'chat-123' } },
				{ json: { id: 'chat-456' } },
				{ json: { chat_id: 'chat-789' } },
			];
			
			for (const item of testCases) {
				const result = await postReceive?.call({}, [item], {});
				expect(result[0].json.chatId).toBeDefined();
			}
		});

		it('should normalize text from various field names', async () => {
			const options = (getResponseOperation?.options as any[]) || [];
			const getResponseOption = options.find((opt) => opt.value === 'getResponse');
			const postReceive = getResponseOption?.routing?.output?.postReceive?.[0];
			
			// Mock items with different text field names
			const testCases = [
				{ json: { text: 'Response 1', chatId: 'chat-1' } },
				{ json: { response: 'Response 2', chatId: 'chat-2' } },
				{ json: { content: 'Response 3', chatId: 'chat-3' } },
			];
			
			for (const item of testCases) {
				const result = await postReceive?.call({}, [item], {});
				expect(result[0].json.text).toBeDefined();
			}
		});
	});

	describe('Display Options', () => {
		it('should only show prompt field for getResponse operation', () => {
			const promptField = chatDescription.find(
				(prop) => prop.name === 'prompt'
			);
			
			expect(promptField?.displayOptions?.show?.operation).toEqual(['getResponse']);
			expect(promptField?.displayOptions?.show?.resource).toEqual(['chat']);
		});

		it('should only show chatId field for getResponse operation', () => {
			const chatIdField = chatDescription.find(
				(prop) => prop.name === 'chatId'
			);
			
			expect(chatIdField?.displayOptions?.show?.operation).toEqual(['getResponse']);
			expect(chatIdField?.displayOptions?.show?.resource).toEqual(['chat']);
		});
	});
});

