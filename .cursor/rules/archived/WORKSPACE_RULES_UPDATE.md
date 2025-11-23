# Workspace Rules Update Required

## Context

The repo-specific rules embedded in the workspace configuration need to be updated to reflect the correct understanding of this integration.

## Current Understanding (INCORRECT in workspace rules)

The workspace rules currently describe this as:

- A generic Agencii chat response API integration
- Supporting two operations: Get Response and Create New Chat
- Allowing custom endpoint configuration
- Configuring system prompts and chat behavior

## Correct Understanding (NEEDS UPDATE)

This integration actually:

- Connects to the **Agencii.ai platform** (not a generic API)
- Uses **agency-swarm** infrastructure for multi-agent systems
- Routes to agencies via **Integration ID** from platform's n8n settings
- **NO system prompts configured in n8n** - all agent configuration happens on Agencii.ai platform
- Single operation: **Get Response only**
- **Fixed endpoint**: `https://n8n-webhook-japboyzddq-uc.a.run.app`

## Required Workspace Rule Updates

### Update Project Identity Section

```markdown
# n8n Community Node Integration for Agencii.ai Platform

## Project Identity

This is an n8n community node integration for the **Agencii.ai platform**, which provides agency-swarm powered multi-agent infrastructure.

**Primary node**: `Integration` with one core action:

1. **Get Response** - Send message to agency and receive response from agency's default agent

**NOT A GENERIC AI API**: This node connects to agencies configured on the Agencii.ai platform. Agent behavior, tools, and system prompts are configured on the platform, not in this n8n node.
```

### Update Core Workflows Section

```markdown
## Core Workflow

### Single Operation: Get Response

**Action**: `Get Response`

**Inputs**:

- `prompt` (required): Message or task to send to your agency
- `chatId` (optional, string): Session identifier for conversation continuity

**Behavior**:

- Integration ID (from credentials) identifies which agency to route to on Agencii.ai platform
- Message is sent to agency's default agent
- Agency uses agency-swarm to coordinate agents and process request
- If `chatId` is provided: Agency maintains conversation context
- If `chatId` is NOT provided: New session is created automatically

**Outputs to n8n**:

- `text` or `response`: Agency's response
- `chatId`: Session identifier (incoming or newly created)
- Optional: `usage`, `metadata`, `model`, etc.

**Key Point**: No "Create New Chat" operation exists. Session creation is automatic when chatId is not provided.
```

### Update Platform Architecture Section

```markdown
## Platform Architecture

### Agencii.ai Platform

- Built on [agency-swarm](https://github.com/VRSEN/agency-swarm) framework
- Hosts and manages multi-agent AI systems (agencies)
- Each agency has multiple specialized agents with tools and capabilities
- Agencies coordinate agents to accomplish complex tasks

### Integration Flow

1. User creates agency on Agencii.ai platform
2. User configures n8n integration settings for agency
3. Platform generates Integration ID for that agency
4. User adds Integration ID to n8n credentials
5. n8n node sends messages → Integration ID routes to correct agency → Agency's default agent receives message
6. Agency processes via agency-swarm → Returns response to n8n

### Configuration Separation

**Configured on Agencii.ai Platform** (NOT in n8n):

- Agent instructions and system prompts
- Agent tools and capabilities
- Multi-agent coordination rules
- Agency structure and hierarchy
- Default agent selection

**Configured in n8n Node**:

- Integration ID (which agency to connect to)
- Message/task to send
- Session management (chatId)
- Optional parameters (model, temperature, max tokens)
```

### Update Development Rules Section

```markdown
## Development Rules

### Critical Understanding

This node is a **connectivity layer** between n8n and Agencii.ai platform. It does NOT:

- ❌ Implement AI logic
- ❌ Configure agent behavior
- ❌ Set system prompts
- ❌ Define agent tools or capabilities
- ❌ Create multi-agent coordination

All of the above happens on the Agencii.ai platform via agency-swarm.

### What This Node Does

- ✅ Authenticates via Integration ID
- ✅ Routes messages to correct agency
- ✅ Sends user messages/tasks
- ✅ Maintains session continuity (chatId)
- ✅ Returns agency responses to n8n
- ✅ Handles errors and edge cases

### Endpoint Configuration

- **Fixed endpoint**: `https://n8n-webhook-japboyzddq-uc.a.run.app`
- **No custom endpoints**: Endpoint is hardcoded to Agencii.ai platform
- **Routing**: Integration ID in Authorization header routes to correct agency

### No System Prompts

Do not add or suggest system prompt configuration in this node. System prompts and agent instructions are configured on the Agencii.ai platform for each agency.
```

## Action Required

The workspace-level repo-specific rules need to be manually updated to reflect these corrections. The rules are stored in the workspace configuration, not in a file that can be edited directly.

## Files Already Updated

✅ README.md - Updated with correct platform understanding  
✅ .cursor/rules/agencii_workflows.md - Completely rewritten with platform architecture  
✅ REFACTORING_SUMMARY.md - Updated to reflect platform integration  
✅ All code files - Already aligned with single operation, fixed endpoint

## Next Steps

1. Update the workspace-level repo-specific rules manually or via workspace settings
2. Ensure all AI assistance respects the platform architecture
3. Emphasize that this is a **connectivity integration**, not an AI implementation

