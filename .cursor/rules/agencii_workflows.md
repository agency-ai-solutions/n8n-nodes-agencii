# Agencii.ai Platform n8n Integration - Workflow Guide

> Technical documentation for the Agencii.ai platform n8n integration.
> See workspace rules for main development guidelines.

## Platform Architecture

### What is Agencii.ai?

Agencii.ai is an AI automation platform built on [agency-swarm](https://github.com/VRSEN/agency-swarm) that provides infrastructure for deploying and managing multi-agent AI systems (agencies).

### How the n8n Integration Works

1. **Agency Setup**: Users create agencies on the Agencii.ai platform using agency-swarm
2. **n8n Integration Configuration**: Each agency has n8n integration settings in the platform
3. **Integration ID**: A unique Integration ID (API key) identifies which agency to route requests to
4. **Default Agent**: Each agency has a default agent that receives messages from n8n
5. **Agency Processing**: The agency coordinates between its agents to process requests
6. **Response**: The agency returns results back to the n8n workflow

### Key Concepts

- **Agency**: A multi-agent system configured on Agencii.ai platform
- **Agent**: Individual AI agents within an agency, each with specific tools and capabilities
- **Integration ID**: The API key that routes n8n requests to a specific agency
- **Default Agent**: The primary agent in an agency that receives incoming n8n messages
- **Session/Chat**: A conversation thread that maintains context across multiple messages

**Important**: Agent behavior, system prompts, tools, and capabilities are configured within the Agencii.ai platform, NOT in the n8n node. The n8n node simply provides the connection.

---

## Workflow Pattern: Get Response

**Goal**: Send a message to your agency and receive a response from your agency's default agent.

### n8n Node Structure

```
Trigger (Webhook/Manual/Schedule)
  ↓
Agencii Integration node – Operation: "Get Response"
  ↓
Downstream nodes (Set/Slack/HTTP Request/etc.)
```

### Inputs to `Get Response`

- `prompt` (string, **required**): The message or task to send to your agency
- `chatId` (string, **optional**): Session identifier to maintain conversation context
  - If provided: Continues existing conversation with that session
  - If NOT provided: Creates new session automatically

### Behavior

- **Request Routing**:
  - Integration ID (from credentials) identifies target agency
  - Message is routed to agency's default agent
  - Agency processes request using its configured agents and tools

- **Session Management**:
  - **If `chatId` is provided**: Agency maintains context from previous messages in that session
  - **If `chatId` is NOT provided**: New session is created; agency extracts new session ID from platform

### Outputs from `Get Response`

- `text` / `response`: The agency's response to your message
- `chatId`: The session identifier:
  - Equal to incoming `chatId` (if provided)
  - New session ID returned by platform (if none provided)
- Optional: `usage` (token stats), `metadata`, `model`, timestamps, etc.

### Usage Patterns

**Single Request (No Context)**:

```
- Don't provide chatId on input
- Agency processes request as standalone task
- Optionally store returned chatId for future use
```

**Multi-Turn Conversation (With Context)**:

```
Step 1: Initial message
- Leave chatId empty
- Store returned chatId from output

Step 2+: Follow-up messages
- Provide stored chatId to maintain context
- Agency remembers previous exchanges in this session
```

---

## Example n8n Expression Mappings

**Passing chatId between nodes**:

```javascript
{
  {
    $node["First Message"].json["chatId"];
  }
}
```

**Conditional chatId (use existing or leave empty for new session)**:

```javascript
{
  {
    $json.existingChatId || "";
  }
}
```

**Extracting agency response**:

```javascript
{
  {
    $node["Agencii"].json["text"];
  }
}
```

---

## Important Notes

### Configuration is Platform-Side

The following are **NOT** configured in the n8n node:

- ❌ System prompts / Agent instructions
- ❌ Agent tools and capabilities
- ❌ Multi-agent coordination rules
- ❌ Agency structure and hierarchy

These are all configured within your agency setup on the Agencii.ai platform.

### What You Control in n8n

- ✅ Which agency to connect to (via Integration ID in credentials)
- ✅ The message/task to send to your agency
- ✅ Session continuity (via chatId)
- 🚫 No client-side AI tuning (model, temperature, max tokens are configured on the Agencii.ai platform)

### Endpoint Configuration

- The endpoint URL is hardcoded to: `https://n8n-webhook-japboyzddq-uc.a.run.app`
- This is the Agencii.ai platform's n8n integration endpoint
- Your Integration ID in the Authorization header routes to your specific agency

---

## Troubleshooting

**Problem**: Agency not responding as expected  
**Solution**: Check your agency configuration on Agencii.ai platform - agent instructions, tools, and behavior are configured there

**Problem**: Wrong agency receiving messages  
**Solution**: Verify the Integration ID in your n8n credentials matches the ID from your agency's n8n settings page on Agencii.ai

**Problem**: Context not maintained across messages  
**Solution**: Ensure you're passing the same `chatId` between sequential Get Response nodes

---

## Development Guidelines

When working on this integration:

1. **Focus on connectivity**: This node connects n8n to Agencii.ai - it doesn't implement AI logic
2. **Platform-agnostic parameters**: The node should accept messages and return responses without assumptions about agency internals
3. **Clear documentation**: Help users understand the separation between n8n configuration (this node) and agency configuration (Agencii.ai platform)
4. **Session management**: Properly handle `chatId` to enable conversational workflows
5. **Error handling**: Provide clear errors that help users debug both connectivity issues and agency configuration problems
