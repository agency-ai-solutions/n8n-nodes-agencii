import type { ICredentialType, INodeProperties, IAuthenticateGeneric, ICredentialTestRequest } from "n8n-workflow";

export class AgenciiApi implements ICredentialType {
  name = "agenciiApi";
  displayName = "Agencii API";
  documentationUrl = "https://agency-swarm.ai/platform/integrations/n8n-integration";
  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      typeOptions: { password: true },
      default: "",
      required: true,
      description: "Your Agencii API key for authentication. You can find this in your Agencii dashboard.",
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

  test: ICredentialTestRequest = {
    request: {
      url: "https://bearer-verification-japboyzddq-uc.a.run.app",
      method: "GET",
    },
  };
}
