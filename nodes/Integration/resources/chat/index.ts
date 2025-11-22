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
                // Normalize the response to ensure sessionId and text are always present
                const normalizedItems = items.map((item) => {
                  const data = item.json as Record<string, unknown>;

                  // Extract session/chat identifier (might be in different fields)
                  const chatId = (data.chatId || data.id || data.chat_id || data.sessionId) as string;

                  // Extract agency response text (might be in different fields)
                  const text = (data.text || data.response || data.content || data.message) as string;

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
    ],
    default: "sendMessage",
  },
  ...chatSendMessageDescription,
];
