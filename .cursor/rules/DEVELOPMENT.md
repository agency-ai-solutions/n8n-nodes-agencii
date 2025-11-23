# Development Guide

> **For Developers**: This guide covers local development, testing, building, and contributing to the Agencii n8n community node.

**Prerequisites**: Read [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) first to understand the project's architecture and identity.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Project Setup](#project-setup)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Building](#building)
- [Code Standards](#code-standards)
- [Common Development Tasks](#common-development-tasks)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v8.x or higher
- **n8n**: v1.0.0 or higher (for testing)
- **TypeScript**: v5.x (installed as dev dependency)
- **Git**: For version control

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd n8n-community-node-integration

# Install dependencies
npm install

# Build the node
npm run build

# Run tests
npm test

# Watch mode for development
npm run build:watch
```

---

## 🔧 Project Setup

### 1. Install Dependencies

```bash
npm install
```

This installs:

- n8n-workflow (peer dependency for node development)
- TypeScript compiler and type definitions
- Jest testing framework
- ESLint for code linting
- Other development dependencies

### 2. Verify Installation

```bash
# Check TypeScript compilation
npx tsc --version

# Check Jest
npx jest --version

# Check ESLint
npx eslint --version
```

### 3. Link to Local n8n (Optional)

For testing the node in a local n8n instance:

```bash
# In this project directory
npm link

# In your n8n installation directory
npm link n8n-nodes-agencii
```

Then restart your n8n instance to load the node.

---

## 🔄 Development Workflow

### Recommended Workflow

1. **Create a branch** for your feature/fix
2. **Write/update tests** first (TDD approach)
3. **Implement changes** to make tests pass
4. **Run tests** to verify behavior
5. **Lint code** to ensure quality
6. **Build** to verify compilation
7. **Test manually** in n8n (if applicable)
8. **Commit changes** with clear messages
9. **Submit pull request**

### Watch Mode for Active Development

```bash
# Terminal 1: Watch TypeScript compilation
npm run build:watch

# Terminal 2: Watch tests
npm test -- --watch

# Terminal 3: Run local n8n instance
npx n8n start
```

---

## 🧪 Testing

### Test Structure

Tests are colocated with source files in `__tests__/` directories:

```
nodes/Integration/
├── resources/
│   └── chat/
│       ├── sendMessage.ts
│       └── __tests__/
│           └── sendMessage.test.ts
└── utils/
    ├── errorHandler.ts
    └── __tests__/
        └── errorHandler.test.ts
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm test -- --watch

# Run specific test file
npm test -- sendMessage.test

# Run with coverage report
npm test -- --coverage

# Run tests matching pattern
npm test -- -t "should normalize response"
```

### Writing Tests

**Test Naming Convention**:

```typescript
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should do something specific', () => {
      // Arrange
      const input = ...;

      // Act
      const result = ...;

      // Assert
      expect(result).toBe(...);
    });
  });
});
```

**Testing Operation Definitions**:

```typescript
import { chatSendMessageDescription } from "../sendMessage";

describe("Send Message Operation", () => {
  it("should define message parameter correctly", () => {
    const messageParam = chatSendMessageDescription.find((p) => p.name === "message");

    expect(messageParam).toBeDefined();
    expect(messageParam?.type).toBe("string");
    expect(messageParam?.required).toBe(true);
  });
});
```

**Testing Utilities**:

```typescript
import { handleAgenciiError } from "../errorHandler";

describe("handleAgenciiError", () => {
  it("should extract error message from error object", () => {
    const error = { error: "Something went wrong" };
    const result = handleAgenciiError(error);

    expect(result).toBe("Something went wrong");
  });
});
```

### Test Coverage Goals

- **Operation definitions**: 100% (verify all parameters, routing, display options)
- **Utilities**: 90%+ (cover main paths and edge cases)
- **Integration tests**: Focus on parameter mapping and response normalization

---

## 🏗️ Building

### Build Commands

```bash
# Full build (clean + compile)
npm run build

# Watch mode (recompile on changes)
npm run build:watch

# Clean build artifacts
rm -rf dist/
```

### Build Process

1. **TypeScript compilation**: Compiles `nodes/**/*.ts` to `dist/`
2. **Type checking**: Verifies type correctness
3. **Asset copying**: Copies JSON and SVG files to `dist/`
4. **Sourcemap generation**: Creates `.map` files for debugging

### Build Output Structure

```
dist/
├── credentials/
│   └── AgenciiApi.credentials.js
├── nodes/
│   └── Integration/
│       ├── Integration.node.js
│       ├── Integration.node.json
│       ├── integration.svg
│       ├── integration.dark.svg
│       └── resources/
│           └── chat/
│               ├── index.js
│               └── sendMessage.js
└── package.json
```

### Verification

```bash
# Check if build succeeded
npm run build && echo "Build successful!"

# Verify dist/ structure
ls -R dist/

# Check for TypeScript errors
npx tsc --noEmit
```

---

## 📏 Code Standards

### TypeScript Guidelines

**Strict Mode**:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**Type Safety**:

```typescript
// ✅ Good: Explicit types
function processResponse(response: AgenciiChatResponse): string {
  return response.text || response.response || "No response";
}

// ❌ Bad: Implicit any
function processResponse(response) {
  return response.text;
}
```

**Prefer unknown over any**:

```typescript
// ✅ Good: unknown + narrowing
function handleError(error: unknown): string {
  if (typeof error === "object" && error !== null && "error" in error) {
    return String(error.error);
  }
  return "Unknown error";
}

// ❌ Bad: any (no type safety)
function handleError(error: any): string {
  return error.error;
}
```

### Code Organization

**DRY Principle**:

```typescript
// ✅ Good: Shared utility
import { handleAgenciiError } from "../../utils/errorHandler";

export function sendMessage() {
  try {
    // ... operation logic
  } catch (error) {
    throw new Error(handleAgenciiError(error));
  }
}

// ❌ Bad: Duplicated error handling in each operation
export function sendMessage() {
  try {
    // ... operation logic
  } catch (error) {
    if (typeof error === "object" && "error" in error) {
      throw new Error(error.error);
    }
    // ... repeated logic
  }
}
```

**Small, Focused Functions**:

```typescript
// ✅ Good: Single responsibility
function extractSessionId(response: AgenciiChatResponse): string {
  return response.sessionId || response.chatId || "";
}

function extractResponseText(response: AgenciiChatResponse): string {
  return response.text || response.response || "";
}

// ❌ Bad: Does too much
function processResponse(response: AgenciiChatResponse): Record<string, unknown> {
  const sessionId = response.sessionId || response.chatId || "";
  const text = response.text || response.response || "";
  // ... many more transformations
  return { sessionId, text /* ... */ };
}
```

### ESLint Configuration

```bash
# Lint all files
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Lint specific files
npm run lint -- nodes/Integration/**/*.ts
```

**Common Linting Rules**:

- No unused variables
- No implicit any
- Prefer const over let
- Use === instead of ==
- Semicolons required

---

## 🛠️ Common Development Tasks

### Task 1: Adding a New Parameter

**Example**: Add a `maxTokens` parameter to `Send Message`

1. **Update tests first** (TDD):

```typescript
// sendMessage.test.ts
it("should define maxTokens parameter correctly", () => {
  const maxTokensParam = chatSendMessageDescription.find((p) => p.name === "maxTokens");

  expect(maxTokensParam).toBeDefined();
  expect(maxTokensParam?.type).toBe("number");
  expect(maxTokensParam?.required).toBe(false);
  expect(maxTokensParam?.routing?.send?.property).toBe("max_tokens");
});
```

2. **Run tests** (should fail):

```bash
npm test -- sendMessage.test
```

3. **Add parameter definition**:

```typescript
// sendMessage.ts
export const chatSendMessageDescription: INodeProperties[] = [
  // ... existing parameters
  {
    displayName: "Max Tokens",
    name: "maxTokens",
    type: "number",
    default: 1000,
    displayOptions: {
      show: showOnlyForChatSendMessage,
    },
    description: "Maximum number of tokens to generate",
    routing: {
      send: {
        type: "body",
        property: "max_tokens",
      },
    },
  },
];
```

4. **Run tests** (should pass):

```bash
npm test -- sendMessage.test
```

5. **Update documentation**:
   - Add parameter to README.md usage section
   - Update PROJECT_OVERVIEW.md if it changes behavior

### Task 2: Modifying Response Normalization

**Example**: Extract and return a new field from API response

1. **Update type definition**:

```typescript
// utils/types.ts
export interface AgenciiChatResponse {
  text?: string;
  response?: string;
  sessionId?: string;
  chatId?: string;
  usage?: Record<string, unknown>; // ← Add new field
}
```

2. **Update tests**:

```typescript
// sendMessage.test.ts
it("should include usage field in output", () => {
  const response: AgenciiChatResponse = {
    text: "Hello",
    sessionId: "abc123",
    usage: { tokens: 100 },
  };

  // ... test that usage is returned
});
```

3. **Update routing** (if needed):

```typescript
// sendMessage.ts
routing: {
  output: {
    postReceive: [
      {
        type: 'set',
        properties: {
          value: '={{ $response.body.usage }}',
        },
      },
    ],
  },
},
```

### Task 3: Handling a New Error Format

**Example**: Backend starts returning errors in a new structure

1. **Add test case**:

```typescript
// errorHandler.test.ts
it("should handle new error format", () => {
  const error = {
    error: {
      message: "Rate limit exceeded",
      code: "RATE_LIMIT",
    },
  };

  const result = handleAgenciiError(error);
  expect(result).toContain("Rate limit exceeded");
});
```

2. **Update error handler**:

```typescript
// errorHandler.ts
export function handleAgenciiError(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    // Handle nested error object
    if ("error" in error && typeof error.error === "object") {
      const nestedError = error.error as Record<string, unknown>;
      if ("message" in nestedError) {
        return String(nestedError.message);
      }
    }

    // ... existing error handling
  }

  return "Unknown error occurred";
}
```

### Task 4: Debugging in n8n

1. **Build with source maps**:

```bash
npm run build
```

2. **Link to n8n**:

```bash
npm link
cd /path/to/n8n
npm link n8n-nodes-agencii
```

3. **Add debug logging** (temporary):

```typescript
console.log("DEBUG: Request payload:", payload);
```

4. **Run n8n in dev mode**:

```bash
npx n8n start
```

5. **Check n8n console** for debug output

6. **Remove debug logging** before committing

---

## 🐛 Troubleshooting

### Build Issues

**Problem**: TypeScript compilation errors

```bash
# Check for type errors
npx tsc --noEmit

# Check specific file
npx tsc --noEmit nodes/Integration/Integration.node.ts
```

**Problem**: Missing dependencies

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Build output not reflecting changes

```bash
# Clean build
rm -rf dist/
npm run build
```

### Test Issues

**Problem**: Tests fail after changes

```bash
# Run tests with detailed output
npm test -- --verbose

# Run specific failing test
npm test -- -t "test name"

# Update snapshots (if using)
npm test -- -u
```

**Problem**: Mock not working

```typescript
// Ensure mocks are defined before imports
jest.mock("../../utils/errorHandler");

import { handleAgenciiError } from "../../utils/errorHandler";
```

### Runtime Issues

**Problem**: Node not appearing in n8n

1. Check n8n logs for loading errors
2. Verify `package.json` n8n configuration
3. Ensure node is properly linked
4. Restart n8n instance

**Problem**: Authentication failures

1. Verify API Key in n8n credentials
2. Check Integration ID is correct
3. Test credentials in n8n credential tester

**Problem**: Unexpected response structure

1. Log raw response in operation handler
2. Compare with expected type definition
3. Update type definition if backend changed
4. Update tests to reflect new structure

---

## 🤝 Contributing

### Contribution Workflow

1. **Fork the repository**

2. **Create a feature branch**:

```bash
git checkout -b feature/your-feature-name
```

3. **Make changes** following TDD workflow:
   - Write/update tests
   - Implement feature
   - Verify tests pass
   - Lint code

4. **Commit with clear messages**:

```bash
git commit -m "feat: add maxTokens parameter to Send Message operation"
```

### Commit Message Convention

Format: `<type>: <description>`

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Test additions/changes
- `refactor`: Code refactoring
- `chore`: Maintenance tasks

**Examples**:

```
feat: add support for custom retry logic
fix: correct sessionId handling in multi-turn conversations
docs: update README with new parameter examples
test: add coverage for error handler edge cases
refactor: extract response normalization to utility function
```

### Pull Request Guidelines

**Before submitting**:

- ✅ All tests pass (`npm test`)
- ✅ Code is linted (`npm run lint`)
- ✅ Build succeeds (`npm run build`)
- ✅ Documentation is updated
- ✅ Commit messages are clear

**PR Description should include**:

- What changed and why
- Link to related issue (if any)
- Screenshots/examples (if UI change)
- Testing performed
- Breaking changes (if any)

### Code Review Process

1. Automated checks run (tests, lint, build)
2. Maintainer reviews code for:
   - Alignment with project goals
   - Code quality and standards
   - Test coverage
   - Documentation completeness
3. Feedback provided or approval given
4. Changes merged to main branch

---

## 📊 Performance Considerations

### Build Performance

- **Incremental builds**: Use `npm run build:watch` during development
- **Parallel compilation**: TypeScript compiles files in parallel
- **Selective testing**: Run specific tests during development

### Runtime Performance

- **Response normalization**: Keep transformations lightweight
- **Error handling**: Avoid expensive operations in error paths
- **Type checking**: Rely on compile-time checks, not runtime validation

---

## 📚 Additional Resources

### n8n Development

- [n8n Node Development Guide](https://docs.n8n.io/integrations/creating-nodes/)
- [n8n Declarative Node Style](https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### Testing

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

## 🆘 Getting Help

### Development Questions

- Check [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for architecture understanding
- Review existing tests for examples
- Check n8n documentation for node development patterns

### Issues

- Search [existing issues](https://github.com/<repo>/issues) first
- Open new issue with:
  - Clear description
  - Steps to reproduce (if bug)
  - Expected vs actual behavior
  - Environment details (Node version, n8n version, OS)

### Community

- [n8n Community Forum](https://community.n8n.io/)
- [n8n Discord](https://discord.gg/n8n)

---

**Last Updated**: 2025-11-23  
**Maintained By**: Development Team
