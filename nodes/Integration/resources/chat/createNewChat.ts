import type { INodeProperties } from 'n8n-workflow';

const showOnlyForChatCreate = {
	operation: ['createNewChat'],
	resource: ['chat'],
};

export const chatCreateNewChatDescription: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showOnlyForChatCreate,
		},
		options: [
			{
				displayName: 'System Message',
				name: 'systemMessage',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'Optional system message to set the behavior or context for this chat session',
				routing: {
					send: {
						type: 'body',
						property: 'systemMessage',
					},
				},
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				description: 'Optional metadata to attach to this chat session',
				options: [
					{
						name: 'metadataValues',
						displayName: 'Metadata',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								description: 'Metadata key',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Metadata value',
							},
						],
					},
				],
				routing: {
					send: {
						preSend: [
							async function(this, requestOptions) {
								const metadata = this.getNodeParameter('additionalFields.metadata') as {
									metadataValues?: Array<{ key: string; value: string }>;
								};
								
								if (metadata?.metadataValues) {
									const metadataObj: Record<string, string> = {};
									metadata.metadataValues.forEach((item) => {
										if (item.key) {
											metadataObj[item.key] = item.value;
										}
									});
									
									if (Object.keys(metadataObj).length > 0) {
										requestOptions.body = requestOptions.body || {};
										(requestOptions.body as Record<string, unknown>).metadata = metadataObj;
									}
								}
								
								return requestOptions;
							},
						],
					},
				},
			},
		],
	},
];

