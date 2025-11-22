import type { INodeProperties } from "n8n-workflow";

const showOnlyForChatSendMessage = {
  operation: ["sendMessage"],
  resource: ["chat"],
};

export const chatSendMessageDescription: INodeProperties[] = [
  {
    displayName: "Message",
    name: "prompt",
    type: "string",
    typeOptions: {
      rows: 4,
    },
    default: "",
    required: true,
    displayOptions: {
      show: showOnlyForChatSendMessage,
    },
    description: "The message or task to send to your agency on the Agencii.ai platform",
    routing: {
      send: {
        type: "body",
        property: "prompt",
      },
    },
  },
  {
    displayName: "Session ID",
    name: "chatId",
    type: "string",
    default: "",
    displayOptions: {
      show: showOnlyForChatSendMessage,
    },
    description:
      "Optional: Session identifier to continue a conversation with your agency. If not provided, a new session will be created automatically.",
    routing: {
      send: {
        type: "body",
        property: "chatId",
      },
    },
  },
  {
    displayName: "Integration ID",
    name: "integrationId",
    type: "string",
    default: "",
    required: true,
    displayOptions: {
      show: showOnlyForChatSendMessage,
    },
    description: "Your Agencii Integration ID (automatically populated from credentials)",
    routing: {
      send: {
        type: "query",
        property: "integration_id",
      },
    },
  },
];
