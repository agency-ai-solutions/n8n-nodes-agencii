# Technical Reference: Agencii n8n Integration Workflows

> **For AI Assistants & Advanced Users**: Technical reference for API interactions, workflow patterns, and integration architecture.
> See [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for complete project context.

---

## 📋 Document Purpose

This document provides technical details about:

- API request/response formats
- Workflow patterns and best practices
- n8n expression mappings
- Edge cases and error scenarios
- Advanced integration patterns

**For general usage**, see [README.md](../README.md).  
**For development**, see [DEVELOPMENT.md](./DEVELOPMENT.md).

---

## 🏗️ Platform Architecture

### Agencii.ai Platform Overview

**Agencii.ai** is built on [agency-swarm](https://github.com/VRSEN/agency-swarm), providing infrastructure for multi-agent AI systems.

**Key Components**:

- **Agency**: Multi-agent system where specialized agents collaborate
- **Agents**: Individual AI agents with specific tools and capabilities
- **Agency-Swarm**: Coordination framework that manages agent interactions
- **Default Agent**: Primary agent that receives incoming n8n messages
- **Session**: Conversation thread maintaining context across messages

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     n8n Workflow                             │
│                                                              │
│  ┌──────────────┐                                           │
│  │ Agencii Node │                                           │
│  │              │                                           │
│  │ Parameters:  │                                           │
│  │ - message    │                                           │
│  │ - sessionId  │                                           │
│  │ - integrationId                                          │
│  └──────┬───────┘                                           │
└─────────┼────────────────────────────────────────────────────┘
          │
          │ HTTPS POST
          │ URL: https://n8n-webhook-qd6wo466iq-uc.a.run.app
          │ Query: ?integration_id={integrationId}
          │ Headers: Authorization: Bearer {API_KEY}
          │ Body: { message, sessionId, operation: "getResponse" }
          │
          ↓
┌─────────────────────────────────────────────────────────────┐
│               Agencii.ai Platform Endpoint                   │
│                                                              │
│  1. Validates API Key (Authorization header)                │
│  2. Routes to agency via Integration ID (query param)       │
│  3. Forwards message to agency's default agent              │
└──────────┬──────────────────────────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────────────────────────┐
│                 Agency on Agencii.ai Platform                │
│                                                              │
│  ┌────────────┐     ┌────────────┐     ┌────────────┐      │
│  │  Agent 1   │────→│  Agent 2   │────→│  Agent 3   │      │
│  │ (Default)  │     │ (Specialist)│     │ (Specialist)│      │
│  │            │     │            │     │            │      │
│  │ - Receives │     │ - Uses     │     │ - Uses     │      │
│  │   message  │     │   tools    │     │   tools    │      │
│  │ - Delegates│     │ - Returns  │     │ - Returns  │      │
│  │   tasks    │     │   data     │     │   data     │      │
│  └────────────┘     └────────────┘     └────────────┘      │
│                                                              │
│  Agency-swarm coordinates agents based on configuration     │
│  Maintains session context if sessionId provided            │
└──────────┬──────────────────────────────────────────────────┘
           │
           │ Response JSON
           │ { text, sessionId, n8nIntegrationId, metadata... }
           │
           ↓
┌─────────────────────────────────────────────────────────────┐
│                     n8n Workflow                             │
│                                                              │
│  ┌──────────────┐                                           │
│  │  Next Node   │                                           │
│  │              │                                           │
│  │ Receives:    │                                           │
│  │ - text       │                                           │
│  │ - sessionId  │                                           │
│  │ - metadata   │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

### Authentication & Routing Mechanism

**Two-Layer Identification**:

1. **API Key** (Authorization header):
   - Authenticates user with Agencii.ai platform
   - Validates account access and permissions
   - Retrieved from Agencii.ai dashboard

2. **Integration ID** (query parameter):
   - Routes request to specific agency
   - Each agency has unique Integration ID
   - Retrieved from agency's n8n integration settings

**Why Two Identifiers?**

- Enables one API Key to access multiple agencies
- Allows different nodes to connect to different agencies
- Simplifies credential management in n8n

---

## 📡 API Specification

### HTTP Request Format

**Endpoint**: `https://n8n-webhook-qd6wo466iq-uc.a.run.app`

**Method**: `POST`

**Query Parameters**:

```
?integration_id={integrationId}
```

**Headers**:

```
Authorization: Bearer {API_KEY}
Content-Type: application/json
Accept: application/json
```

**Request Body**:

```json
{
  "message": "Your message or task here",
  "sessionId": "optional-session-identifier",
  "operation": "getResponse"
}
```

### Request Body Fields

| Field       | Type   | Required | Description                                          |
| ----------- | ------ | -------- | ---------------------------------------------------- |
| `message`   | string | ✅ Yes   | The message or task to send to the agency            |
| `sessionId` | string | ❌ No    | Session identifier for conversation continuity       |
| `operation` | string | ✅ Yes   | Always "getResponse" (internal operation identifier) |

### HTTP Response Format

**Success Response** (200 OK):

```json
{
  "text": "The agency's response text",
  "response": "The agency's response text",
  "sessionId": "session-identifier",
  "n8nIntegrationId": "integration-id-used",
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 100,
    "total_tokens": 150
  },
  "metadata": {
    "model": "gpt-4",
    "timestamp": "2025-11-23T12:00:00Z"
  }
}
```

**Response Fields**:

| Field              | Type   | Always Present | Description                                |
| ------------------ | ------ | -------------- | ------------------------------------------ |
| `text`             | string | ✅ Yes         | Primary response text from agency          |
| `response`         | string | ✅ Yes         | Alias for `text` (backwards compatibility) |
| `sessionId`        | string | ✅ Yes         | Session identifier (new or existing)       |
| `n8nIntegrationId` | string | ✅ Yes         | Echo of Integration ID used                |
| `usage`            | object | ❌ No          | Token usage statistics (if available)      |
| `metadata`         | object | ❌ No          | Additional backend metadata                |

**Error Response** (4xx, 5xx):

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": {
    /* additional context */
  }
}
```

or

```json
{
  "message": "Error message description"
}
```

---

## 🔄 Workflow Patterns

### Pattern 1: Single Request (Stateless)

**Use Case**: One-time tasks without requiring context.

**n8n Workflow**:

```
Trigger (Webhook/Manual/Schedule)
  ↓
Agencii Node
  - message: "Analyze this data: {{$json.data}}"
  - sessionId: (empty)
  - integrationId: "abc123..."
  ↓
Response:
  - text: "Analysis complete: ..."
  - sessionId: "new-session-xyz" (store if needed later)
  ↓
Set Node / HTTP Node / Database Node
```

**Characteristics**:

- ✅ Simple: No session management required
- ✅ Fast: Single request/response
- ❌ No context: Each request is independent
- ❌ No memory: Agency doesn't remember previous requests

**When to Use**:

- One-off data processing
- Independent task execution
- No need for conversational context

### Pattern 2: Multi-Turn Conversation (Stateful)

**Use Case**: Tasks requiring context across multiple interactions.

**n8n Workflow**:

```
Step 1: Initial Request
  Agencii Node #1
    - message: "What are the Q3 sales trends?"
    - sessionId: (empty)
    - integrationId: "abc123..."
  Response:
    - text: "Q3 sales increased by 15%..."
    - sessionId: "session-456"

  ↓ Pass sessionId to next step

Step 2: Follow-Up (with context)
  Agencii Node #2
    - message: "What should our Q4 strategy be?"
    - sessionId: "session-456" (from Step 1)
    - integrationId: "abc123..."
  Response:
    - text: "Based on the Q3 trends..." (contextual response)
    - sessionId: "session-456"

  ↓ Continue with same sessionId

Step 3: Further Context
  Agencii Node #3
    - message: "Create an action plan"
    - sessionId: "session-456"
    - integrationId: "abc123..."
  Response:
    - text: "Action plan based on Q3 trends and Q4 strategy..."
    - sessionId: "session-456"
```

**Characteristics**:

- ✅ Contextual: Agency remembers previous exchanges
- ✅ Intelligent: Responses build on prior information
- ✅ Efficient: No need to repeat information
- ⚠️ Complex: Requires session management
- ⚠️ Stateful: Session persistence needed

**When to Use**:

- Multi-step analysis or research
- Interactive data exploration
- Complex task decomposition
- Conversational interfaces

### Pattern 3: Conditional Session Reuse

**Use Case**: Optionally continue existing session or start new one.

**n8n Workflow**:

```
IF Node: Check if sessionId exists
  ↓ True Branch
  Agencii Node
    - message: "{{$json.message}}"
    - sessionId: "{{$json.existingSessionId}}" (reuse)
    - integrationId: "abc123..."

  ↓ False Branch
  Agencii Node
    - message: "{{$json.message}}"
    - sessionId: (empty - create new)
    - integrationId: "abc123..."
```

**Use Cases**:

- User can choose to continue previous conversation
- Workflow adapts based on data availability
- Long-running sessions with optional reset

### Pattern 4: Parallel Agency Access

**Use Case**: Query multiple agencies simultaneously.

**n8n Workflow**:

```
Trigger
  ↓ Split to parallel branches
  ├──→ Agencii Node (Sales Agency)
  │      - message: "Review sales data"
  │      - integrationId: "sales-123"
  │
  ├──→ Agencii Node (Legal Agency)
  │      - message: "Check compliance"
  │      - integrationId: "legal-456"
  │
  └──→ Agencii Node (Finance Agency)
         - message: "Analyze costs"
         - integrationId: "finance-789"
  ↓ Merge responses
  Merge Node
  ↓
  Process combined insights
```

**Characteristics**:

- ✅ Parallel execution: Faster overall workflow
- ✅ Specialized agencies: Each handles its domain
- ✅ Independent sessions: No cross-agency context
- ⚠️ Coordination: Merging responses requires logic

**When to Use**:

- Tasks requiring multiple specialized skills
- Independent data validation from different perspectives
- Parallel processing for speed

### Pattern 5: Session Persistence Across Workflow Executions

**Use Case**: Maintain long-running conversations across workflow runs.

**n8n Workflow**:

```
Workflow Execution 1:
  Trigger
    ↓
  Agencii Node
    - message: "Initial request"
    - sessionId: (empty)
    ↓
  Store sessionId in:
    - n8n Static Data
    - Database (PostgreSQL/MySQL)
    - Redis/Cache
    - External Storage

Workflow Execution 2 (later):
  Trigger
    ↓
  Retrieve sessionId from storage
    ↓
  Agencii Node
    - message: "Follow-up request"
    - sessionId: "{{$json.storedSessionId}}"
    ↓
  Agency continues conversation from previous execution
```

**Use Cases**:

- Customer support conversations spanning days
- Long-term project management
- Persistent research sessions

---

## 🧑‍💻 n8n Expression Mappings

### Basic Session ID Passing

**Pass sessionId from previous node**:

```javascript
{
  {
    $node["Previous Agencii Node"].json["sessionId"];
  }
}
```

**Alternative notation**:

```javascript
{
  {
    $("Previous Agencii Node").item.json.sessionId;
  }
}
```

### Conditional Session ID

**Use existing sessionId or empty for new session**:

```javascript
{
  {
    $json.existingSessionId || "";
  }
}
```

**Use sessionId only if it exists and is not empty**:

```javascript
{
  {
    $json.sessionId ? $json.sessionId : "";
  }
}
```

### Extracting Response Text

**Get response text**:

```javascript
{
  {
    $node["Agencii"].json["text"];
  }
}
```

**Fallback to response field**:

```javascript
{
  {
    $node["Agencii"].json["text"] || $node["Agencii"].json["response"];
  }
}
```

### Working with Metadata

**Extract token usage**:

```javascript
{
  {
    $node["Agencii"].json["usage"]["total_tokens"];
  }
}
```

**Check if usage data exists**:

```javascript
{
  {
    $node["Agencii"].json.usage ? $node["Agencii"].json.usage.total_tokens : 0;
  }
}
```

### Advanced Patterns

**Store sessionId in Set node for later use**:

```javascript
// In Set node
{
  "conversationId": "{{ $node["Agencii"].json["sessionId"] }}",
  "lastResponse": "{{ $node["Agencii"].json["text"] }}",
  "timestamp": "{{ $now }}"
}
```

**Build message from multiple sources**:

```javascript
{
  {
    "Analyze this data: " + $json.data + " and compare with: " + $json.comparison;
  }
}
```

**Dynamic Integration ID selection**:

```javascript
{
  {
    $json.department === "sales" ? "sales-integration-id" : "support-integration-id";
  }
}
```

---

## ⚙️ Configuration & Control

### What's Configured Where

**On Agencii.ai Platform** (NOT in n8n):

- ❌ Agent instructions and system prompts
- ❌ Agent tools and capabilities
- ❌ Multi-agent coordination rules
- ❌ Agency structure and hierarchy
- ❌ Default agent selection
- ❌ Model selection (GPT-4, Claude, etc.)
- ❌ Temperature and token limits
- ❌ Agent memory and knowledge bases

**In n8n Node** (this integration):

- ✅ Which agency to connect to (Integration ID)
- ✅ Message/task content
- ✅ Session management (sessionId)
- ✅ Workflow orchestration

**Why this separation?**

- **Simplicity**: n8n workflows remain simple and focused
- **Flexibility**: Change agent behavior without touching n8n
- **Centralization**: Agency configuration managed in one place
- **Specialization**: Each tool does what it's best at

### Endpoint Configuration

**Fixed Endpoint**: `https://n8n-webhook-qd6wo466iq-uc.a.run.app`

- Hardcoded in `Integration.node.ts`
- Not user-configurable (intentional)
- Routing handled by Integration ID, not endpoint URL

**Why fixed endpoint?**

- Consistent platform integration point
- Simplified user configuration
- Prevents misrouting errors
- Centralized infrastructure management

---

## 🚨 Error Scenarios & Handling

### Authentication Errors

**Error**: Invalid API Key

```json
{ "error": "Unauthorized", "code": "INVALID_API_KEY" }
```

**Cause**: API Key incorrect or expired

**Solution**:

- Verify API Key in n8n credentials
- Check Agencii.ai dashboard for correct key
- Regenerate API Key if necessary

---

**Error**: Invalid Integration ID

```json
{ "error": "Agency not found", "code": "INVALID_INTEGRATION_ID" }
```

**Cause**: Integration ID doesn't match any agency

**Solution**:

- Verify Integration ID in node parameters
- Check agency's n8n integration settings on Agencii.ai
- Ensure agency is active and not deleted

### Session Errors

**Error**: Session not found

```json
{ "error": "Session not found or expired", "code": "SESSION_NOT_FOUND" }
```

**Cause**: sessionId invalid or expired

**Solution**:

- Start new session by omitting sessionId
- Check session timeout settings on Agencii.ai
- Verify sessionId is being passed correctly

### Request Errors

**Error**: Rate limit exceeded

```json
{ "error": "Rate limit exceeded", "code": "RATE_LIMIT" }
```

**Cause**: Too many requests in short time

**Solution**:

- Add delay between requests (Wait node)
- Implement exponential backoff retry logic
- Check account usage limits on Agencii.ai
- Upgrade plan if needed

---

**Error**: Timeout

```json
{ "error": "Request timeout", "code": "TIMEOUT" }
```

**Cause**: Agency processing took too long

**Solution**:

- Increase timeout in n8n HTTP node settings
- Simplify agency workflow on Agencii.ai
- Split complex tasks into smaller steps
- Use error workflow for timeout handling

### Response Errors

**Error**: Empty or malformed response

**Cause**: Agency returned unexpected format

**Solution**:

- Check agency logs on Agencii.ai
- Verify agent configuration is correct
- Ensure agents have necessary tools
- Contact Agencii.ai support if persistent

---

## 🔧 Advanced Integration Patterns

### Pattern: Retry Logic with Exponential Backoff

```
Agencii Node
  ↓ (on error)
IF Node: Check error code
  ↓ (if rate limit or timeout)
Wait Node: {{ $json.retryCount ? $json.retryCount * 2 : 2 }} seconds
  ↓
Set Node: Increment retryCount
  ↓
Loop back to Agencii Node (max 3 retries)
```

### Pattern: Session Timeout Handling

```
Agencii Node with stored sessionId
  ↓ (on session error)
IF Node: Check error code === "SESSION_NOT_FOUND"
  ↓ True branch
Agencii Node: Retry with empty sessionId (new session)
  ↓
Store new sessionId
```

### Pattern: Response Validation

```
Agencii Node
  ↓
IF Node: Validate response structure
  - Check if text exists and is not empty
  - Check if sessionId exists
  ↓ Invalid
Error Node: Log and notify
```

### Pattern: Multi-Agency Orchestration

```
Coordinator Agency (decides which specialist to use)
  ↓ Response indicates: "sales"
  ↓
Sales Agency (handles sales query)
  ↓ Response
  ↓
Coordinator Agency (with context from sales)
  ↓ Final response
```

---

## 📊 Best Practices

### Session Management

**✅ DO**:

- Store sessionId for multi-turn conversations
- Use meaningful session identifiers in logs
- Implement session timeout handling
- Clear sessions when conversation ends

**❌ DON'T**:

- Reuse sessionId across unrelated conversations
- Assume sessions last forever (they expire)
- Share sessionId across different users
- Hardcode sessionId values

### Error Handling

**✅ DO**:

- Implement retry logic for transient errors
- Log errors with context (Integration ID, message, sessionId)
- Provide user-friendly error messages
- Set up error workflows for critical failures

**❌ DON'T**:

- Silently swallow errors
- Retry indefinitely without backoff
- Expose sensitive data in error messages
- Ignore error codes (handle each appropriately)

### Performance

**✅ DO**:

- Use parallel agency access when tasks are independent
- Cache sessionId instead of creating new sessions repeatedly
- Monitor response times and optimize agency workflows
- Use specific, clear messages for better agency processing

**❌ DON'T**:

- Make unnecessary sequential requests
- Create new sessions for every request in a conversation
- Send extremely long messages (affects processing time)
- Overload agencies with rapid-fire requests

### Security

**✅ DO**:

- Store API Keys in n8n credentials (encrypted)
- Use HTTPS for all requests (handled by n8n)
- Rotate API Keys periodically
- Limit Integration ID exposure

**❌ DON'T**:

- Log or display API Keys
- Hardcode credentials in workflows
- Share Integration IDs publicly
- Expose sessionIds to untrusted parties

---

## 🧪 Testing Strategies

### Unit Testing (in Development)

See [DEVELOPMENT.md](./DEVELOPMENT.md) for test implementation details.

### Integration Testing (in n8n)

**Test 1: Basic connectivity**:

```
Manual Trigger → Agencii Node → Check response structure
```

**Test 2: Session continuity**:

```
Agencii Node #1 → Store sessionId → Agencii Node #2 (with sessionId) → Verify context maintained
```

**Test 3: Error handling**:

```
Agencii Node with invalid Integration ID → Verify error caught
```

**Test 4: Multi-agency routing**:

```
Parallel: Agencii Node (Agency A) & Agencii Node (Agency B) → Merge → Verify both responded correctly
```

---

## 📚 Additional Resources

### Platform Documentation

- [Agencii.ai Platform](https://agencii.ai)
- [Agency Swarm Documentation](https://agency-swarm.ai/welcome/overview)
- [Agency-Swarm GitHub](https://github.com/VRSEN/agency-swarm)

### n8n Resources

- [n8n Expressions](https://docs.n8n.io/code-examples/expressions/)
- [n8n Error Handling](https://docs.n8n.io/workflows/error-handling/)
- [n8n HTTP Request Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)

---

**Last Updated**: 2025-11-23  
**Document Version**: 1.0
**Status**: Technical Reference
