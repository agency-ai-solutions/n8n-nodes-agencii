import type { INodeProperties } from 'n8n-workflow';

const showOnlyForChatGetResponse = {
	operation: ['getResponse'],
	resource: ['chat'],
};

export const chatGetResponseDescription: INodeProperties[] = [
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForChatGetResponse,
		},
		description: 'The prompt or message to send to the Agencii API for generating a completion',
		routing: {
			send: {
				type: 'body',
				property: 'prompt',
			},
		},
	},
	{
		displayName: 'Chat ID',
		name: 'chatId',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForChatGetResponse,
		},
		description: 'Optional: Existing chat ID to continue a conversation. If not provided, a new chat will be created automatically.',
		routing: {
			send: {
				type: 'body',
				property: 'chatId',
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showOnlyForChatGetResponse,
		},
		options: [
			{
				displayName: 'Model',
				name: 'model',
				type: 'string',
				default: '',
				description: 'Specific AI model to use for this completion',
				routing: {
					send: {
						type: 'body',
						property: 'model',
					},
				},
			},
			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 2,
					numberPrecision: 1,
				},
				default: 1,
				description: 'Controls randomness in the response. Lower values make output more focused and deterministic.',
				routing: {
					send: {
						type: 'body',
						property: 'temperature',
					},
				},
			},
			{
				displayName: 'Max Tokens',
				name: 'maxTokens',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 1000,
				description: 'Maximum number of tokens to generate in the response',
				routing: {
					send: {
						type: 'body',
						property: 'maxTokens',
					},
				},
			},
		],
	},
];

