# n8n-nodes-agencii

This is an n8n community node for the **Agencii Chat Response API**. It lets you generate AI completions and manage conversational chat sessions in your n8n workflows.

[Agencii](https://agencii.com) is an AI platform that provides powerful chat completion capabilities for building conversational applications.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Table of Contents

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Usage](#usage)
  - [Workflow 1: Single Completion](#workflow-1-single-completion)
  - [Workflow 2: Multi-Turn Conversation](#workflow-2-multi-turn-conversation)
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

The Agencii node supports the following operations:

### Chat Resource

#### Get Response

Generate an AI completion with optional chat reuse. This is the primary operation for generating responses from the Agencii API.

**Parameters:**

- **Prompt** (required): The text prompt or message to send to the AI
- **Chat ID** (optional): Existing chat identifier to continue a conversation. If not provided, a new chat is created automatically.
- **Additional Fields:**
  - **Model**: Specify which AI model to use
  - **Temperature**: Control response randomness (0-2)
  - **Max Tokens**: Limit the response length

**Returns:**

- `text` or `response`: The AI-generated completion
- `chatId`: The chat identifier (existing or newly created)
- `usage`: Token usage statistics (if available)
- `metadata`: Additional response metadata
- `model`: The model used for the completion

#### Create New Chat

Explicitly create a new chat session for multi-turn conversations.

**Parameters:**

- **Additional Fields:**
  - **System Message**: Set the behavior or context for the chat session
  - **Metadata**: Custom key-value pairs to attach to the session

**Returns:**

- `chatId`: The newly created chat identifier
- `createdAt`: Timestamp of creation
- `metadata`: Attached metadata

## Credentials

To use this node, you need to configure your Agencii API credentials:

### Prerequisites

1. Sign up for an Agencii account at [agencii.com](https://agencii.com)
2. Navigate to your dashboard and generate an API key under **API Settings**

### Setting Up Credentials in n8n

1. In n8n, go to **Credentials** and click **Add Credential**
2. Search for **Agencii API** and select it
3. Fill in the following fields:
   - **API Key**: Your Agencii API key
   - **Base URL**: The API endpoint (default: `https://api.agencii.com/v1`)
4. Click **Save**

### Authentication Method

The node uses Bearer token authentication. Your API key is automatically included in the `Authorization` header for all requests.

## Usage

### Workflow 1: Single Completion

Use the **Get Response** operation to generate a single completion. This is ideal for one-off requests where you don't need to maintain conversation history.

**Example Use Case:** Generate a product description from a product name

```
1. Add an Agencii node to your workflow
2. Select Resource: Chat
3. Select Operation: Get Response
4. Set Prompt: "Generate a catchy product description for: {{$json.productName}}"
5. Leave Chat ID empty (a new chat will be created automatically)
```

**Result:** The node returns the AI-generated text and a `chatId` (which you can ignore if you don't need it).

### Workflow 2: Multi-Turn Conversation

For conversational flows where context matters, use **Create New Chat** followed by multiple **Get Response** calls with the same `chatId`.

**Example Use Case:** Customer support chatbot with context awareness

```
Step 1: Initialize the conversation
- Add an Agencii node
- Select Resource: Chat
- Select Operation: Create New Chat
- Set System Message: "You are a helpful customer support agent"
- Store the returned chatId in a variable: {{$json.chatId}}

Step 2: First user message
- Add another Agencii node
- Select Resource: Chat
- Select Operation: Get Response
- Set Prompt: {{$json.userMessage}}
- Set Chat ID: {{$node["Create New Chat"].json.chatId}}

Step 3: Follow-up messages
- Continue using Get Response with the same Chat ID
- The AI will maintain context from previous messages
```

**Benefits:**

- The AI remembers previous messages in the conversation
- More natural and contextual responses
- Efficient token usage (you don't need to resend full history)

### Advanced Patterns

#### Conditional Chat Creation

Use an IF node to check if a `chatId` exists. If yes, reuse it; if no, create a new chat.

#### Chat Session Management

Store `chatId` values in n8n's built-in data storage or an external database to maintain long-running conversations across multiple workflow executions.

#### Response Customization

Use the **Additional Fields** options to fine-tune AI behavior:

- Lower **Temperature** (0-0.5) for factual, consistent responses
- Higher **Temperature** (1-2) for creative, varied responses
- Adjust **Max Tokens** to control response length and cost

## Compatibility

- **Minimum n8n version:** 1.0.0
- **Tested on:** n8n v1.0.0+
- **Node API Version:** 1

This node uses n8n's declarative routing feature for simplified API integration.

## Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community Nodes](https://docs.n8n.io/integrations/#community-nodes)
- [Agencii API Documentation](https://docs.agencii.com/api)
- [Agencii Platform](https://agencii.com)

## Support

For issues, questions, or feature requests:

- Open an issue on [GitHub](https://github.com/agency-ai-solutions/n8n-community-node-integration/issues)
- Join the [n8n community](https://community.n8n.io/)

## Version History

### 0.1.0 (Initial Release)

- ✨ Initial implementation of Agencii Chat Response API integration
- 🚀 Support for two core operations:
  - **Get Response**: Single completion with optional chat reuse
  - **Create New Chat**: Explicit chat session initialization
- 🔐 Secure API authentication with Bearer tokens
- 📊 Token usage statistics and metadata in responses
- 🎛️ Advanced options: model selection, temperature control, max tokens
- 📝 Comprehensive documentation and workflow examples

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
