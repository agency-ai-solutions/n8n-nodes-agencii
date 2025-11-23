# Agencii n8n Community Node - Project Overview

> **AI Assistant Reference**: This document provides the complete project context for AI assistants working on this codebase. Read this first to understand the project's identity, architecture, and development guidelines.

---

## 📋 Quick Reference

- **Project**: n8n community node for Agencii.ai Platform
- **Package**: `n8n-nodes-agencii`
- **Purpose**: Connect n8n workflows to agency-swarm powered agencies on Agencii.ai
- **Node Name**: `Agencii`
- **Primary Operation**: `Send Message` (internal: `sendMessage`)
- **Architecture**: Connectivity layer (NOT an AI implementation)

---

## 🎯 Project Identity

### What This Is

This is an **n8n community node integration** for the **Agencii.ai platform**. It provides a connectivity layer that enables n8n workflows to communicate with multi-agent AI systems (agencies) hosted on the Agencii.ai platform.

### What This Is NOT

- ❌ **NOT a generic chat completion API client**
- ❌ **NOT an AI implementation** (no AI logic in this codebase)
- ❌ **NOT an agent configuration tool** (agents are configured on the Agencii.ai platform)
- ❌ **NOT a wrapper around OpenAI/Anthropic/etc.** (uses agency-swarm infrastructure)

### Key Distinction

**Configuration Separation**:

- **Agencii.ai Platform** (external): Agencies, agents, tools, system prompts, agent behavior, multi-agent coordination
- **This n8n Node** (this repo): Message routing, session management, request/response handling

---

## 🏗️ Platform Architecture

### Agencii.ai Platform

[Agencii.ai](https://agencii.ai) is an AI automation platform built on [agency-swarm](https://github.com/VRSEN/agency-swarm), which provides infrastructure for deploying and managing multi-agent AI systems.

**Key Components**:

- **Agency**: A multi-agent system where specialized agents work together
- **Agents**: Individual AI agents, each with specific tools and capabilities
- **Agency-Swarm**: The underlying framework that coordinates agents
- **Default Agent**: The primary agent in an agency that receives incoming messages

### Integration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         n8n Workflow                             │
│  ┌───────────────┐                                               │
│  │  Agencii Node │ ← User configures: message, sessionId,        │
│  │               │   integrationId                               │
│  └───────┬───────┘                                               │
└──────────┼─────────────────────────────────────────────────────┘
           │
           │ HTTPS POST with Integration ID in query param
           ↓
┌─────────────────────────────────────────────────────────────────┐
│               Agencii.ai Platform n8n Endpoint                   │
│              https://n8n-webhook-qd6wo466iq-uc.a.run.app         │
│                                                                   │
│  1. Receives request with Integration ID                         │
│  2. Routes to correct agency                                     │
│  3. Forwards message to agency's default agent                   │
└──────────┬─────────────────────────────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────────────────────────────┐
│                  Agency (on Agencii.ai Platform)                 │
│                                                                   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   Agent 1   │───→│   Agent 2   │───→│   Agent 3   │         │
│  │  (Default)  │    │             │    │             │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                   │
│  Agency-swarm coordinates agents to process request              │
└──────────┬─────────────────────────────────────────────────────┘
           │
           │ Response with text, sessionId, metadata
           ↓
┌─────────────────────────────────────────────────────────────────┐
│                         n8n Workflow                             │
│  ┌───────────────┐                                               │
│  │  Next Node    │ ← Receives: text, sessionId, metadata         │
│  └───────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
```

### Authentication & Routing

**Integration ID**:

- Each agency on Agencii.ai has a unique Integration ID for n8n access
- Integration ID is provided as a query parameter (`integration_id`)
- Routes n8n messages to the correct agency's default agent
- Retrieved from agency's n8n integration settings page on Agencii.ai

**API Key**:

- Separate authentication credential for Agencii.ai API access
- Passed in `Authorization: Bearer {API_KEY}` header
- Retrieved from Agencii.ai dashboard

---

## 🔄 Core Workflow

### Single Operation: Send Message

**User-Facing Name**: `Send Message`  
**Internal Name**: `sendMessage`  
**Operation Value**: `getResponse` (sent to backend)

#### Inputs

| Parameter       | Type   | Required | Description                                           |
| --------------- | ------ | -------- | ----------------------------------------------------- |
| `message`       | string | ✅ Yes   | The message or task to send to your agency            |
| `sessionId`     | string | ❌ No    | Session identifier for conversation continuity        |
| `integrationId` | string | ✅ Yes   | Your agency's Integration ID from Agencii.ai platform |

#### Behavior

1. **If `sessionId` is provided**:
   - Agency maintains context from previous messages in that session
   - Enables multi-turn conversations with context awareness

2. **If `sessionId` is NOT provided**:
   - Backend creates a new session automatically
   - Returns new `sessionId` in response for future use

3. **Integration ID routing**:
   - Sent as query parameter `integration_id`
   - Platform routes request to correct agency
   - Agency's default agent receives the message

#### Outputs

| Field              | Type   | Description                                        |
| ------------------ | ------ | -------------------------------------------------- |
| `text`             | string | The agency's response to your message              |
| `response`         | string | Alias for `text` (backwards compatibility)         |
| `sessionId`        | string | Session identifier for continuing the conversation |
| `n8nIntegrationId` | string | Echo of the Integration ID used                    |
| `usage`            | object | Optional: Token usage statistics                   |
| `metadata`         | object | Optional: Additional backend metadata              |

#### Usage Patterns

**Pattern 1: Single Request (No Context)**

```
User → Agencii Node
       - message: "Analyze this data: {data}"
       - sessionId: (empty)
       - integrationId: "abc123..."

Response → Next Node
       - text: "Analysis complete: {results}"
       - sessionId: "new-session-xyz" (store for later)
```

**Pattern 2: Multi-Turn Conversation**

```
Step 1:
User → Agencii Node #1
       - message: "What are the sales trends?"
       - sessionId: (empty)
       - integrationId: "abc123..."

Response:
       - text: "Q3 sales increased by 15%..."
       - sessionId: "session-123"

Step 2:
User → Agencii Node #2
       - message: "What should our Q4 strategy be?"
       - sessionId: "session-123" (from Step 1)
       - integrationId: "abc123..."

Response:
       - text: "Based on the Q3 trends I analyzed..." (maintains context)
       - sessionId: "session-123"
```

---

## 📁 Project Structure

```
n8n-community-node-integration/
├── .cursor/
│   └── rules/                          # Documentation for AI assistants
│       ├── PROJECT_OVERVIEW.md         # ⭐ This file (read first)
│       ├── DEVELOPMENT.md              # Developer guidelines
│       ├── agencii_workflows.md        # Technical workflow reference
│       └── [archived/]                 # Old documentation (for reference only)
│
├── credentials/
│   └── AgenciiApi.credentials.ts       # n8n credential configuration
│
├── nodes/
│   └── Integration/
│       ├── Integration.node.ts         # Main node definition
│       ├── integration.svg             # Node icon (light mode)
│       ├── integration.dark.svg        # Node icon (dark mode)
│       ├── Integration.node.json       # Node metadata
│       │
│       ├── resources/
│       │   └── chat/                   # Chat resource (only resource)
│       │       ├── index.ts            # Resource definition & routing
│       │       ├── sendMessage.ts      # Send Message operation handler
│       │       └── __tests__/
│       │           └── sendMessage.test.ts
│       │
│       └── utils/                      # Shared utilities
│           ├── types.ts                # TypeScript type definitions
│           ├── errorHandler.ts         # Error handling utilities
│           └── __tests__/
│               └── errorHandler.test.ts
│
├── dist/                               # Compiled output (generated)
├── package.json                        # Package configuration
├── tsconfig.json                       # TypeScript configuration
├── jest.config.js                      # Test configuration
├── eslint.config.mjs                   # ESLint configuration
└── README.md                           # User-facing documentation
```

### File Responsibilities

| File                                    | Purpose                                     | Key Exports                                   |
| --------------------------------------- | ------------------------------------------- | --------------------------------------------- |
| `Integration.node.ts`                   | Node definition, routing, UI configuration  | `Integration` class                           |
| `credentials/AgenciiApi.credentials.ts` | Authentication configuration                | Credential definition                         |
| `resources/chat/index.ts`               | Resource definition & operation routing     | `chatDescription`                             |
| `resources/chat/sendMessage.ts`         | Send Message operation parameters & routing | `chatSendMessageDescription`                  |
| `utils/types.ts`                        | Shared TypeScript interfaces                | `AgenciiChatResponse`, `AgenciiErrorResponse` |
| `utils/errorHandler.ts`                 | Error normalization utilities               | `handleAgenciiError()`, `validateResponse()`  |

---

## 🛠️ Development Principles

### Always Follow Workspace Rules

1. **1-3-1 Rule**: When stuck → 1 problem, 3 options, 1 recommendation → wait for confirmation
2. **DRY (Don't Repeat Yourself)**: Refactor before copying code
3. **TDD (Test-Driven Development)**: Check/update tests before writing code
4. **Todo-First**: Create todo list before starting complex tasks
5. **Ultrathink**: Consider API shapes, UX, and extensibility before coding

### Critical Understanding

This node is a **connectivity layer**, NOT an AI implementation:

**What This Node Does** ✅:

- Authenticates with Agencii.ai API (Bearer token)
- Routes messages to correct agency (via Integration ID)
- Sends user messages/tasks to agency
- Maintains session continuity (via sessionId)
- Returns agency responses to n8n workflow
- Handles errors and normalizes responses

**What This Node Does NOT Do** ❌:

- Implement AI logic or agent behavior
- Configure agent tools or capabilities
- Set system prompts or agent instructions
- Create multi-agent coordination
- Directly interact with LLM APIs

### Endpoint Configuration

- **Fixed Endpoint**: `https://n8n-webhook-qd6wo466iq-uc.a.run.app`
- **No Custom Endpoints**: Hardcoded to Agencii.ai platform
- **Routing Mechanism**: Integration ID (query param) routes to correct agency
- **Authentication**: API Key in Authorization header

### Code Organization

**DRY Enforcement**:

- Shared utilities in `utils/` directory
- Single source of truth for types, errors, and common logic
- No duplication across operation handlers

**Strong Typing**:

- TypeScript strict mode
- Explicit interfaces for all API responses
- Prefer `unknown` + narrowing over `any`
- Validate assumptions about response shapes

**Testing Requirements**:

- Test coverage for all operations
- Mock HTTP responses deterministically
- Verify parameter mapping (n8n → API request)
- Verify response normalization (API response → n8n output)
- Test error handling paths

### n8n Integration Standards

**Parameter Naming**:

- User-facing: Clear, descriptive names (e.g., "Message", "Session ID")
- Internal: camelCase (e.g., `message`, `sessionId`)
- Backend: Match API expectations (e.g., `message`, `sessionId`, `operation`)

**Response Normalization**:

- Always extract and return `text` (primary response)
- Always extract and return `sessionId` (for continuity)
- Include `response` as alias for `text` (backwards compatibility)
- Pass through additional metadata fields as-is

**Error Handling**:

- Use `handleAgenciiError()` utility for consistent error messages
- Extract meaningful error messages from various response shapes
- Provide fallback messages for unknown errors
- Include context in error messages (e.g., operation name)

---

## 🧪 Testing Strategy

### Test-Driven Development (TDD)

**Before writing new code**:

1. Read existing tests to understand current behavior
2. Write or update tests to specify desired behavior
3. Run tests to confirm they fail (red)
4. Implement feature to make tests pass (green)
5. Refactor while keeping tests passing

### Test Coverage Requirements

**Operation Tests** (`sendMessage.test.ts`):

- ✅ Operation definition structure
- ✅ Parameter definitions (name, type, required, routing)
- ✅ Display options and conditional rendering
- ✅ Request routing (body/query param mapping)
- ✅ Response normalization

**Utility Tests** (`errorHandler.test.ts`):

- ✅ Error message extraction from various formats
- ✅ Response type validation
- ✅ Fallback error handling
- ✅ Edge cases (null, undefined, malformed responses)

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- sendMessage.test

# Run with coverage
npm test -- --coverage
```

---

## 📝 Documentation Structure

### For AI Assistants

1. **PROJECT_OVERVIEW.md** (this file): Complete project context, read first
2. **DEVELOPMENT.md**: Detailed development guidelines and patterns
3. **agencii_workflows.md**: Technical workflow and API reference

### For End Users

1. **README.md**: Installation, setup, usage examples, troubleshooting

### For Developers

1. **DEVELOPMENT.md**: Local development setup, testing, building, contributing
2. Code comments: Inline documentation for complex logic
3. Type definitions: Self-documenting via TypeScript interfaces

---

## 🚀 Common Tasks

### Adding a New Parameter

1. ✅ Check tests first (TDD)
2. Add parameter definition to `sendMessage.ts`
3. Configure routing (body, query, or header)
4. Update type definitions if needed
5. Update tests to verify parameter behavior
6. Update user-facing documentation

### Updating Error Handling

1. ✅ Update tests in `errorHandler.test.ts` first
2. Modify `handleAgenciiError()` or `validateResponse()`
3. Run tests to confirm behavior
4. Update any operation handlers that use utilities

### Modifying API Endpoint

⚠️ **Rare Operation**: Endpoint is fixed to Agencii.ai platform

If endpoint URL changes:

1. Update `requestDefaults.baseURL` in `Integration.node.ts`
2. Update documentation referencing the endpoint
3. Notify users of breaking change

### Debugging Integration Issues

**Problem**: Wrong agency receiving messages  
**Check**: Verify `integrationId` parameter is correctly passed and matches agency's ID on Agencii.ai

**Problem**: Context not maintained  
**Check**: Ensure `sessionId` from previous response is passed to subsequent calls

**Problem**: Authentication failures  
**Check**: Verify API Key in credentials is valid and Integration ID is correct

---

## 🔒 Security & Best Practices

### Credential Management

- ✅ API Key stored in n8n credentials (encrypted)
- ✅ Integration ID passed as query parameter (not sensitive)
- ❌ Never commit credentials to git
- ❌ Never log credentials in error messages

### Error Messages

- ✅ Include helpful context for debugging
- ✅ Normalize error formats for consistency
- ❌ Don't expose internal system details
- ❌ Don't leak credentials or sensitive data

### Code Quality

- ✅ Use TypeScript strict mode
- ✅ Lint with ESLint before committing
- ✅ Write tests for new features
- ✅ Keep functions small and focused
- ❌ Avoid `any` type (use `unknown` + narrowing)
- ❌ Don't manually edit `dist/` files

---

## 📚 External Resources

### Agencii.ai Platform

- [Agencii.ai Platform](https://agencii.ai)
- [Agency Swarm Documentation](https://agency-swarm.ai/welcome/overview)
- [Agency Swarm GitHub](https://github.com/VRSEN/agency-swarm)

### n8n Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Community Forum](https://community.n8n.io/)

### Development Tools

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [ESLint](https://eslint.org/docs/latest/)

---

## 🎯 Success Criteria

A well-functioning integration should:

1. ✅ **Connect reliably**: Messages route to correct agency every time
2. ✅ **Maintain context**: Session continuity works across multiple calls
3. ✅ **Handle errors gracefully**: Clear error messages help users debug
4. ✅ **Be predictable**: Outputs are consistent and well-structured
5. ✅ **Stay focused**: Only handles connectivity, not AI configuration
6. ✅ **Document clearly**: Users understand what's configured where

---

## 📞 Support & Contribution

### Getting Help

- **Integration issues**: Check Agencii.ai platform configuration first
- **Node issues**: Open issue on GitHub repository
- **n8n issues**: Visit [n8n community forum](https://community.n8n.io/)

### Contributing

See **DEVELOPMENT.md** for:

- Local development setup
- Building and testing
- Submitting pull requests
- Code review process

---

**Last Updated**: 2025-11-23  
**Status**: Active Development  
**Version**: 0.1.0
