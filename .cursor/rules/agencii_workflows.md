# Agencii n8n Workflow Examples

> Supplementary documentation for Agencii chat workflows in n8n.
> See `.cursorrules` at project root for main development rules.

## Workflow 1: Single Completion (`Get Response`)

**Goal**: Call Agencii once to generate a response, with optional chat reuse.

### n8n Node Structure

```
Trigger (Webhook/Manual/Schedule)
  ↓
Integration node – Operation: "Get Response"
  ↓
Downstream nodes (Set/Slack/HTTP Request/etc.)
```

### Inputs to `Get Response`

- `prompt` (string, **required**): Main text input for the completion
- `chatId` (string, **optional**): Existing chat identifier from:
  - Previous `Create New Chat` step, OR
  - Prior `Get Response` output

### Behavior

- **If `chatId` is provided**:
  - Use `chatId` as the chat/session id parameter in Agencii request
  - Generate completion in the context of that existing chat
- **If `chatId` is NOT provided**:
  - Agencii implicitly creates a new chat
  - Extract newly created chat id from response

### Outputs from `Get Response`

- `text` / `response`: The generated completion content
- `chatId`: The id used for this call:
  - Equal to incoming `chatId` (if provided)
  - New id returned by Agencii (if none provided)
- Optional: `usage`, `metadata`, `model`, timestamps, etc.

### Usage Patterns

**Single-shot call**:

- Don't provide `chatId` on input
- Optionally store returned `chatId` for future use

**Follow-up messages**:

- Feed previously returned `chatId` into next `Get Response` call to maintain context

---

## Workflow 2: Explicit Chat Creation (`Create New Chat` → `Get Response`)

**Goal**: Explicitly create and control a chat/session before sending messages.

### n8n Node Structure

```
Trigger
  ↓
Integration node – Operation: "Create New Chat"
  ↓
Integration node – Operation: "Get Response" (with chatId)
  ↓
Downstream nodes
```

### Inputs to `Create New Chat`

- `initialMessage` / `systemPrompt` (depending on Agencii API):
  - Used to initialize conversation context

### Behavior

- Call Agencii to create chat/session with provided initial data
- Return resulting `chatId` and important metadata

### Outputs from `Create New Chat`

- `chatId`: Identifier for the new chat/session
- Optional: initial system/assistant messages, configuration, metadata

### Usage Pattern

- Map `chatId` from `Create New Chat` output into `chatId` field of `Get Response` in subsequent step
- Enables multi-step workflows where same chat is reused across many `Get Response` calls

---

## Example n8n Expression Mappings

**Passing chatId between nodes**:

```javascript
{
  {
    $node["Create New Chat"].json["chatId"];
  }
}
```

**Conditional chatId (use existing or leave empty)**:

```javascript
{
  {
    $json.existingChatId || "";
  }
}
```
