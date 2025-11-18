import type { INodeProperties } from 'n8n-workflow';
import { chatGetResponseDescription } from './getResponse';
import { chatCreateNewChatDescription } from './createNewChat';

const showOnlyForChat = {
	resource: ['chat'],
};

export const chatDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForChat,
		},
		options: [
			{
				name: 'Get Response',
				value: 'getResponse',
				action: 'Generate a completion',
				description: 'Generate a completion with optional chat reuse',
				routing: {
					request: {
						method: 'POST',
						url: '/chat/completions',
					},
					output: {
						postReceive: [
							async function(this, items, responseData) {
								// Normalize the response to ensure chatId and text are always present
								const normalizedItems = items.map((item) => {
									const data = item.json as Record<string, unknown>;
									
									// Extract chatId (might be in different fields)
									const chatId = (data.chatId || data.id || data.chat_id) as string;
									
									// Extract text response (might be in different fields)
									const text = (data.text || data.response || data.content) as string;
									
									return {
										json: {
											...data,
											chatId,
											text,
										},
									};
								});
								
								return normalizedItems;
							},
						],
					},
				},
			},
			{
				name: 'Create New Chat',
				value: 'createNewChat',
				action: 'Create a new chat session',
				description: 'Explicitly initialize a new chat/session for multi-turn conversations',
				routing: {
					request: {
						method: 'POST',
						url: '/chat/create',
					},
					output: {
						postReceive: [
							async function(this, items, responseData) {
								// Normalize the response to ensure chatId is always present
								const normalizedItems = items.map((item) => {
									const data = item.json as Record<string, unknown>;
									
									// Extract chatId (might be in different fields)
									const chatId = (data.chatId || data.id || data.chat_id) as string;
									
									return {
										json: {
											...data,
											chatId,
										},
									};
								});
								
								return normalizedItems;
							},
						],
					},
				},
			},
		],
		default: 'getResponse',
	},
	...chatGetResponseDescription,
	...chatCreateNewChatDescription,
];

