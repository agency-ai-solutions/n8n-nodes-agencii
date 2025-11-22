import type { ICredentialType, INodeProperties, IAuthenticateGeneric } from "n8n-workflow";

export class AgenciiApi implements ICredentialType {
  name = "agenciiApi";
  displayName = "Agencii API";
  documentationUrl = "https://docs.agencii.com/api";
  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      typeOptions: { password: true },
      default: "",
      required: true,
      description: "Your Agencii API key. You can find this in your Agencii dashboard under API Settings.",
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: "generic",
    properties: {
      headers: {
        Authorization: "=Bearer {{$credentials.apiKey}}",
      },
    },
  };
}
