# Documentation Index

> **AI Assistants**: Start with [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for complete project context.

This directory contains structured documentation for the Agencii n8n community node integration.

---

## 📚 Documentation Structure

### For AI Assistants & Developers

#### 1. [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) ⭐ **START HERE**

**Purpose**: Complete project context and identity  
**Audience**: AI assistants, new developers, anyone needing full understanding  
**Contents**:

- Project identity and what it is/isn't
- Platform architecture and integration flow
- Core workflow patterns
- File structure and responsibilities
- Development principles and rules
- Testing strategy
- External resources

**When to Read**: Always read this first when working on the project

---

#### 2. [DEVELOPMENT.md](./DEVELOPMENT.md) 🔧

**Purpose**: Practical development guide  
**Audience**: Active developers working on the codebase  
**Contents**:

- Local setup and installation
- Development workflow (TDD approach)
- Testing and building procedures
- Code standards and best practices
- Common development tasks (with examples)
- Troubleshooting guides
- Contributing guidelines

**When to Read**: When implementing features, fixing bugs, or contributing code

---

#### 3. [agencii_workflows.md](./agencii_workflows.md) 📡

**Purpose**: Technical API and workflow reference  
**Audience**: Advanced users, integration developers, troubleshooters  
**Contents**:

- Detailed API specifications
- HTTP request/response formats
- Workflow patterns (single request, multi-turn, parallel)
- n8n expression mappings
- Error scenarios and handling
- Advanced integration patterns
- Best practices

**When to Read**: When designing workflows, debugging integration issues, or implementing advanced patterns

---

### For End Users

#### 4. [README.md](../../README.md) 📖 (Root)

**Purpose**: User-facing documentation  
**Audience**: n8n users installing and using the node  
**Contents**:

- What is Agencii.ai and how it works
- Installation instructions
- Credentials setup
- Basic usage and examples
- Troubleshooting common issues
- Support resources

**When to Read**: When installing, configuring, or using the node in n8n workflows

---

## 🗂️ Archived Documentation

### [archived/](./archived/)

**Purpose**: Historical documentation for reference  
**Contents**:

- `REFACTORING_SUMMARY.md` - Original refactoring documentation
- `WORKSPACE_RULES_UPDATE.md` - Historical workspace rules corrections
- `README_OLD.md` - Original README that preceded current structure

**When to Read**: Only for historical context; prioritize current documentation

---

## 📖 Reading Guide

### For AI Assistants

**First Time Working on Project**:

1. ✅ Read [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) completely
2. ✅ Skim [DEVELOPMENT.md](./DEVELOPMENT.md) for workflow understanding
3. ✅ Reference [agencii_workflows.md](./agencii_workflows.md) as needed

**When Implementing Features**:

1. ✅ Check [DEVELOPMENT.md](./DEVELOPMENT.md) for development workflow
2. ✅ Reference [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for architecture constraints
3. ✅ Update tests first (TDD approach)

**When Debugging Integration Issues**:

1. ✅ Check [agencii_workflows.md](./agencii_workflows.md) for API details
2. ✅ Review error scenarios and handling patterns
3. ✅ Reference [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for architecture understanding

**When Writing Documentation**:

1. ✅ Maintain consistency with existing structure
2. ✅ Update all relevant files (PROJECT_OVERVIEW.md, DEVELOPMENT.md, README.md)
3. ✅ Keep technical details in agencii_workflows.md
4. ✅ Keep user-facing info in README.md

---

### For Human Developers

**First Day on Project**:

1. Read [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - 15-20 minutes
2. Set up environment using [DEVELOPMENT.md](./DEVELOPMENT.md) - 30-60 minutes
3. Run tests to verify setup - 5 minutes
4. Read through one or two test files to understand patterns - 10 minutes

**Daily Development**:

1. Reference [DEVELOPMENT.md](./DEVELOPMENT.md) for commands and workflows
2. Consult [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for architecture decisions
3. Use [agencii_workflows.md](./agencii_workflows.md) for API specifics

**Helping Users**:

1. Read [README.md](../../README.md) from user perspective
2. Reference [agencii_workflows.md](./agencii_workflows.md) for technical troubleshooting
3. Update [README.md](../../README.md) if common issues arise

---

## 🔄 Documentation Maintenance

### When to Update Each Document

| Document                 | Update When...                                       |
| ------------------------ | ---------------------------------------------------- |
| **PROJECT_OVERVIEW.md**  | Architecture changes, new principles, major features |
| **DEVELOPMENT.md**       | New dev tools, workflow changes, common tasks added  |
| **agencii_workflows.md** | API changes, new patterns, error scenarios           |
| **README.md** (root)     | User-facing changes, new examples, setup changes     |

### Documentation Standards

**All Documentation Should**:

- ✅ Use clear, concise language
- ✅ Include practical examples
- ✅ Stay current with code (update with code changes)
- ✅ Use consistent terminology across files
- ✅ Link to related sections in other documents
- ❌ Don't duplicate information (link instead)
- ❌ Don't include outdated information
- ❌ Don't use jargon without explanation

**Markdown Standards**:

- Use ATX-style headers (`#` instead of underlines)
- Include table of contents for long documents
- Use code blocks with language identifiers
- Use tables for structured data
- Use blockquotes for important notes
- Include last updated dates

---

## 🎯 Quick Reference

### Common Questions

**Q: How do I understand the project architecture?**  
A: Read [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) sections on "Platform Architecture" and "Integration Flow"

**Q: How do I add a new parameter to the node?**  
A: See [DEVELOPMENT.md](./DEVELOPMENT.md) section "Task 1: Adding a New Parameter"

**Q: What's the API request format?**  
A: See [agencii_workflows.md](./agencii_workflows.md) section "API Specification"

**Q: How do I use sessionId in workflows?**  
A: See [README.md](../../README.md) examples or [agencii_workflows.md](./agencii_workflows.md) "Pattern 2: Multi-Turn Conversation"

**Q: The node isn't working, what do I check?**  
A: See [README.md](../../README.md) "Troubleshooting" section first, then [agencii_workflows.md](./agencii_workflows.md) "Error Scenarios"

---

## 📞 Getting Help

**For documentation questions**:

- Check this index first
- Search within relevant document (Ctrl/Cmd + F)
- Read related sections in other documents

**For code questions**:

- See [DEVELOPMENT.md](./DEVELOPMENT.md) "Getting Help" section
- Check test files for examples
- Open issue on GitHub

---

## 🗺️ Navigation Map

```
Documentation Root (.cursor/rules/)
│
├── INDEX.md (this file) ← Documentation guide
│
├── PROJECT_OVERVIEW.md ← Complete project context
│   ├── Identity & Architecture
│   ├── Core Workflow
│   ├── File Structure
│   ├── Development Principles
│   └── External Resources
│
├── DEVELOPMENT.md ← Developer's guide
│   ├── Setup & Installation
│   ├── Development Workflow
│   ├── Testing & Building
│   ├── Code Standards
│   ├── Common Tasks
│   └── Troubleshooting
│
├── agencii_workflows.md ← Technical reference
│   ├── API Specification
│   ├── Workflow Patterns
│   ├── Error Handling
│   ├── Advanced Patterns
│   └── Best Practices
│
├── archived/ ← Historical docs
│   ├── README.md (archive index)
│   ├── REFACTORING_SUMMARY.md
│   ├── WORKSPACE_RULES_UPDATE.md
│   └── README_OLD.md
│
└── (Root: ../../)
    └── README.md ← User documentation
        ├── Installation
        ├── Setup & Configuration
        ├── Usage Examples
        └── Troubleshooting
```

---

## ✨ Documentation Philosophy

This documentation follows these principles:

1. **Separation of Concerns**: Each document has a clear, distinct purpose
2. **Progressive Disclosure**: Start broad (overview), go deep (technical ref)
3. **Audience-First**: Tailored to specific reader needs (AI, dev, user)
4. **Practical Focus**: Examples and real-world usage over theory
5. **Stay Current**: Updated alongside code changes
6. **Link, Don't Duplicate**: Cross-reference instead of copying

---

**Documentation Structure**: v1.0  
**Last Updated**: 2025-11-23  
**Maintained By**: Development Team

---

**Happy Reading! 📖**
