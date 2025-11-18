/**
 * Unit tests for Agencii Chat Resource - Create New Chat operation
 * 
 * Tests verify:
 * - Correct HTTP method and endpoint
 * - Proper parameter mapping to request payload
 * - Response normalization (chatId extraction)
 * - Optional fields handling (systemMessage, metadata)
 */

import { chatDescription } from '../index';
import type { INodeProperties } from 'n8n-workflow';

describe('Chat Resource - Create New Chat', () => {
	let createNewChatOperation: INodeProperties | undefined;

	beforeAll(() => {
		// Find the operation definition
		createNewChatOperation = chatDescription.find(
			(prop) => prop.name === 'operation'
		);
	});

	describe('Operation Definition', () => {
		it('should define createNewChat operation', () => {
			expect(createNewChatOperation).toBeDefined();
			expect(createNewChatOperation?.type).toBe('options');
			
			const options = (createNewChatOperation?.options as any[]) || [];
			const createNewChatOption = options.find((opt) => opt.value === 'createNewChat');
			
			expect(createNewChatOption).toBeDefined();
			expect(createNewChatOption?.name).toBe('Create New Chat');
			expect(createNewChatOption?.action).toBe('Create a new chat session');
		});

		it('should use POST method', () => {
			const options = (createNewChatOperation?.options as any[]) || [];
			const createNewChatOption = options.find((opt) => opt.value === 'createNewChat');
			
			expect(createNewChatOption?.routing?.request?.method).toBe('POST');
		});

		it('should use correct endpoint', () => {
			const options = (createNewChatOperation?.options as any[]) || [];
			const createNewChatOption = options.find((opt) => opt.value === 'createNewChat');
			
			expect(createNewChatOption?.routing?.request?.url).toBe('/chat/create');
		});
	});

	describe('Optional Parameters', () => {
		it('should define additional fields collection', () => {
			const additionalFields = chatDescription.find(
				(prop) => prop.name === 'additionalFields' && 
				prop.displayOptions?.show?.operation?.[0] === 'createNewChat'
			);
			
			expect(additionalFields).toBeDefined();
			expect(additionalFields?.type).toBe('collection');
			
			const options = (additionalFields?.options as any[]) || [];
			expect(options.length).toBeGreaterThan(0);
		});

		it('should include systemMessage option', () => {
			const additionalFields = chatDescription.find(
				(prop) => prop.name === 'additionalFields' && 
				prop.displayOptions?.show?.operation?.[0] === 'createNewChat'
			);
			
			const options = (additionalFields?.options as any[]) || [];
			const systemMessageOption = options.find((opt) => opt.name === 'systemMessage');
			
			expect(systemMessageOption).toBeDefined();
			expect(systemMessageOption?.type).toBe('string');
			expect(systemMessageOption?.routing?.send?.type).toBe('body');
			expect(systemMessageOption?.routing?.send?.property).toBe('systemMessage');
		});

		it('should include metadata option with fixedCollection type', () => {
			const additionalFields = chatDescription.find(
				(prop) => prop.name === 'additionalFields' && 
				prop.displayOptions?.show?.operation?.[0] === 'createNewChat'
			);
			
			const options = (additionalFields?.options as any[]) || [];
			const metadataOption = options.find((opt) => opt.name === 'metadata');
			
			expect(metadataOption).toBeDefined();
			expect(metadataOption?.type).toBe('fixedCollection');
			expect(metadataOption?.typeOptions?.multipleValues).toBe(true);
		});

		it('should define key-value pairs for metadata', () => {
			const additionalFields = chatDescription.find(
				(prop) => prop.name === 'additionalFields' && 
				prop.displayOptions?.show?.operation?.[0] === 'createNewChat'
			);
			
			const options = (additionalFields?.options as any[]) || [];
			const metadataOption = options.find((opt) => opt.name === 'metadata');
			
			expect(metadataOption?.options).toBeDefined();
			expect(Array.isArray(metadataOption?.options)).toBe(true);
			
			const metadataValues = (metadataOption?.options as any[])?.[0]?.values || [];
			const keyField = metadataValues.find((v: any) => v.name === 'key');
			const valueField = metadataValues.find((v: any) => v.name === 'value');
			
			expect(keyField).toBeDefined();
			expect(valueField).toBeDefined();
		});

		it('should have preSend handler for metadata transformation', () => {
			const additionalFields = chatDescription.find(
				(prop) => prop.name === 'additionalFields' && 
				prop.displayOptions?.show?.operation?.[0] === 'createNewChat'
			);
			
			const options = (additionalFields?.options as any[]) || [];
			const metadataOption = options.find((opt) => opt.name === 'metadata');
			
			expect(metadataOption?.routing?.send?.preSend).toBeDefined();
			expect(Array.isArray(metadataOption?.routing?.send?.preSend)).toBe(true);
		});
	});

	describe('Response Normalization', () => {
		it('should define postReceive handler for response normalization', () => {
			const options = (createNewChatOperation?.options as any[]) || [];
			const createNewChatOption = options.find((opt) => opt.value === 'createNewChat');
			
			expect(createNewChatOption?.routing?.output?.postReceive).toBeDefined();
			expect(Array.isArray(createNewChatOption?.routing?.output?.postReceive)).toBe(true);
			expect(createNewChatOption?.routing?.output?.postReceive?.length).toBeGreaterThan(0);
		});

		it('should normalize chatId from various field names', async () => {
			const options = (createNewChatOperation?.options as any[]) || [];
			const createNewChatOption = options.find((opt) => opt.value === 'createNewChat');
			const postReceive = createNewChatOption?.routing?.output?.postReceive?.[0];
			
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
	});

	describe('Display Options', () => {
		it('should only show additional fields for createNewChat operation', () => {
			const additionalFields = chatDescription.find(
				(prop) => prop.name === 'additionalFields' && 
				prop.displayOptions?.show?.operation?.[0] === 'createNewChat'
			);
			
			expect(additionalFields?.displayOptions?.show?.operation).toEqual(['createNewChat']);
			expect(additionalFields?.displayOptions?.show?.resource).toEqual(['chat']);
		});
	});

	describe('Integration Tests', () => {
		it('should have no required fields for createNewChat', () => {
			// Create New Chat should work with no input parameters
			const requiredFields = chatDescription.filter(
				(prop) => 
					prop.required === true && 
					prop.displayOptions?.show?.operation?.[0] === 'createNewChat'
			);
			
			expect(requiredFields.length).toBe(0);
		});

		it('should allow creating chat with just systemMessage', () => {
			const additionalFields = chatDescription.find(
				(prop) => prop.name === 'additionalFields' && 
				prop.displayOptions?.show?.operation?.[0] === 'createNewChat'
			);
			
			const options = (additionalFields?.options as any[]) || [];
			const systemMessageOption = options.find((opt) => opt.name === 'systemMessage');
			
			// System message should be optional (no required flag)
			expect(systemMessageOption?.required).toBeUndefined();
		});
	});
});

