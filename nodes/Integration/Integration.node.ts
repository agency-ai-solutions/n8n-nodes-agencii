import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from "n8n-workflow";
import { chatDescription } from "./resources/chat";

export class Integration implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Agencii",
    name: "agencii",
    icon: { light: "file:integration.svg", dark: "file:integration.dark.svg" },
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: "Interact with the Agencii Chat Response API",
    defaults: {
      name: "Agencii",
    },
    usableAsTool: true,
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: "agenciiApi",
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: "https://n8n-webhook-qd6wo466iq-uc.a.run.app",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
    properties: [
      {
        displayName: "Resource",
        name: "resource",
        type: "options",
        noDataExpression: true,
        options: [
          {
            name: "Chat",
            value: "chat",
          },
        ],
        default: "chat",
      },
      ...chatDescription,
    ],
  };
}
