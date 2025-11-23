import type { INodeProperties } from "n8n-workflow";
import { chatSendMessageDescription } from "./sendMessage";

const showOnlyForChat = {
  resource: ["chat"],
};

export const chatDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: showOnlyForChat,
    },
    options: [
      {
        name: "Send Message",
        value: "sendMessage",
        action: "Send message to agency",
        description: "Send a message to your agency on the Agencii.ai platform and receive a response",
        routing: {
          request: {
            method: "POST",
            url: "/",
          },
          output: {
            postReceive: [
              async function (this, items, responseData) {
                // Clean and normalize the response to only include essential fields
                const normalizedItems = items.map((item) => {
                  const data = item.json as Record<string, unknown>;

                  // Extract session identifier (backend returns 'sessionId')
                  const sessionId = (data.sessionId || data.chatId || data.id || data.chat_id) as string;

                  // Extract agency response text (backend returns 'text' and 'response' as aliases)
                  const text = (data.text || data.response || data.content || data.message) as string;
                  const response = text; // Create alias for backwards compatibility

                  // Return only the essential fields, removing unnecessary keys
                  return {
                    json: {
                      text,
                      response,
                      sessionId,
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
    default: "sendMessage",
  },
  ...chatSendMessageDescription,
];
