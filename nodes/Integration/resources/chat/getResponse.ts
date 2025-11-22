import type { INodeProperties } from "n8n-workflow";

const showOnlyForChatGetResponse = {
  operation: ["getResponse"],
  resource: ["chat"],
};

export const chatGetResponseDescription: INodeProperties[] = [
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
      show: showOnlyForChatGetResponse,
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
      show: showOnlyForChatGetResponse,
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
];
