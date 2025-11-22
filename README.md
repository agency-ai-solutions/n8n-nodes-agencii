# n8n-nodes-agencii

This is an n8n community node for the **Agencii.ai Platform**. It connects your n8n workflows to your agency-swarm powered agencies on the Agencii.ai platform.

[Agencii.ai](https://agencii.ai) is an AI automation platform that uses [agency-swarm](https://github.com/VRSEN/agency-swarm) to provide infrastructure for building and deploying AI agent agencies. The platform enables you to create multi-agent systems where specialized agents work together to accomplish complex tasks.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## How It Works

This integration connects your n8n workflows directly to your agencies on the Agencii.ai platform:

1. **Platform Configuration**: In your Agencii.ai dashboard, you configure n8n integration settings for your agency
2. **Integration ID**: Each agency gets a unique n8n integration ID that identifies which agency to route requests to
3. **Default Agent Routing**: When you send a message through this node, the platform routes it to your agency's default agent
4. **Agency-Swarm Processing**: Your agency (powered by agency-swarm) processes the request using its configured agents and tools
5. **Response**: The agency's response is returned to your n8n workflow for further processing

## Table of Contents

- [How It Works](#how-it-works)
- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Usage](#usage)
- [Compatibility](#compatibility)
- [Resources](#resources)
- [Version History](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Quick Install

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `n8n-nodes-agencii`
4. Agree to the risks and select **Install**

After installation, the **Agencii** node will be available in your node palette.

## Operations

The Agencii node supports the following operation:

### Get Response

Send a message to your agency on the Agencii.ai platform and receive a response from your agency's default agent.

**Parameters:**

- **Prompt** (required): The message or task to send to your agency
- **Chat ID** (optional): Session identifier to continue an existing conversation. If not provided, a new session is created automatically.

Note: Model selection, temperature, max tokens, tools, and agent behavior are configured on the Agencii.ai platform (see [Agency Swarm Overview](https://agency-swarm.ai/welcome/overview)).

**Returns:**

- `text` or `response`: The agency's response to your message
- `chatId`: The session identifier (for continuing the conversation in follow-up calls)
- `usage`: Token usage statistics (if available)
- `metadata`: Additional response metadata
- `model`: The model used for the completion

## Credentials

To use this node, you need to configure your Agencii.ai Platform credentials:

### Prerequisites

1. Sign up for an Agencii.ai account at [agencii.ai](https://agencii.ai)
2. Create or select an agency in your Agencii.ai dashboard
3. Navigate to the n8n Integration settings page for your agency
4. Copy your API key (Integration ID) for n8n access

### Setting Up Credentials in n8n

1. In n8n, go to **Credentials** and click **Add Credential**
2. Search for **Agencii API** and select it
3. Fill in the following field:
   - **API Key**: Your Agencii.ai Integration ID from your agency's n8n settings page
4. Click **Save**

### Authentication Method

The node uses Bearer token authentication. Your Integration ID is automatically included in the `Authorization` header, routing your requests to the correct agency on the Agencii.ai platform.

## Usage

### Single Request

Use the **Get Response** operation to send a single message to your agency and receive a response.

**Example Use Case:** Task execution via agency

```
1. Add an Agencii node to your workflow
2. Select Resource: Chat
3. Select Operation: Get Response
4. Set Prompt: "Analyze the customer feedback data and provide a summary: {{$json.feedbackData}}"
5. Leave Chat ID empty (a new session will be created automatically)
```

**Result:** Your agency processes the request using its configured agents and tools, returning the result.

### Multi-Turn Conversation

For conversational workflows where context matters, reuse the `chatId` from previous calls in subsequent **Get Response** calls to maintain session continuity.

**Example Use Case:** Interactive data analysis with context

```
Step 1: Initial request
- Add an Agencii node
- Select Resource: Chat
- Select Operation: Get Response
- Set Prompt: "Analyze this sales data and identify trends: {{$json.salesData}}"
- Leave Chat ID empty (stores the chatId in output)

Step 2: Follow-up questions
- Add another Agencii node
- Select Resource: Chat
- Select Operation: Get Response
- Set Prompt: "Based on those trends, what should our Q4 strategy be?"
- Set Chat ID: {{$node["Previous Node"].json.chatId}}
- Your agency will remember the previous analysis and provide contextual recommendations
```

**Benefits:**

- Your agency maintains conversation context across multiple interactions
- More natural and contextual task execution
- Efficient processing as the agency remembers prior exchanges

### Advanced Patterns

#### Conditional Session Management

Use an IF node to check if a `chatId` exists. If yes, reuse it for conversation continuity; if no, a new session will be created automatically.

#### Session Persistence

Store `chatId` values in n8n's built-in data storage or an external database to maintain long-running conversations with your agency across multiple workflow executions.

### Understanding Agency Routing

When you send a message through this node:

1. Your **Integration ID** (API Key) identifies which agency to route to
2. The message is sent to your agency's **default agent** (configured in Agencii.ai platform)
3. Your agency, powered by **agency-swarm**, coordinates between its agents to process the request
4. Each agent has specific tools and capabilities configured in your agency setup
5. The agency returns the final response to your n8n workflow

**Note:** Agent behavior, system prompts, tools, and capabilities are all configured within the Agencii.ai platform, not in this n8n node. The node simply connects n8n to your pre-configured agency.

## Compatibility

- **Minimum n8n version:** 1.0.0
- **Tested on:** n8n v1.0.0+
- **Node API Version:** 1

This node uses n8n's declarative routing feature for simplified API integration.

## Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community Nodes](https://docs.n8n.io/integrations/#community-nodes)
- [Agencii.ai Platform](https://agencii.ai)
- [Agency-Swarm Framework](https://github.com/VRSEN/agency-swarm)
- [Agencii.ai Documentation](https://docs.agencii.ai)

## Support

For issues, questions, or feature requests:

- Open an issue on [GitHub](https://github.com/agency-ai-solutions/n8n-nodes-agencii/issues)
- Join the [n8n community](https://community.n8n.io/)

## Version History

### 0.1.0 (Initial Release)

- ✨ Initial implementation of Agencii.ai Platform integration for n8n
- 🚀 Support for **Get Response** operation: Send messages to your agency-swarm powered agencies
- 🔐 Secure API authentication via Integration ID (routes to specific agency)
- 🤖 Direct integration with agency-swarm infrastructure on Agencii.ai
- 📊 Token usage statistics and metadata in responses
- 💬 Session management for multi-turn conversations with agencies
- 📝 Comprehensive documentation and workflow examples

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
