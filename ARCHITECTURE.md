# Architecture Overview

## System Design

ForgeCode AI is built as a desktop application with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                   Electron Main Process                 │
│  (Filesystem, Terminal, Git, Settings, Security)       │
└────────────────────────┬────────────────────────────────┘
                         │
                    IPC (Secure)
                         │
┌────────────────────────▼────────────────────────────────┐
│              React Frontend (Renderer)                  │
│  (UI Components, Editor, File Explorer, Agent Panel)   │
└────────────────────────┬────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐      ┌────▼────┐     ┌────▼────┐
   │ Zustand │      │ Agent   │     │ Monaco  │
   │ Stores  │      │ Engine  │     │ Editor  │
   │         │      │         │     │         │
   └─────────┘      └────┬────┘     └─────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────────┐  ┌────▼──────┐   ┌────▼───────┐
   │ ToolRegistry│  │ Context   │   │ Permission │
   │             │  │ Manager   │   │ Manager    │
   └─────────────┘  └───────────┘   └────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐      ┌────▼────┐     ┌────▼────┐
   │OpenRouter│      │NVIDIA   │     │OpenAI   │
   │Provider  │      │NIM      │     │Compatible
   │          │      │Provider │     │Provider │
   └──────────┘      └─────────┘     └─────────┘
```

## Core Modules

### 1. Desktop Runtime (Electron Main Process)

**Responsibilities:**
- File system operations (read, write, delete, rename)
- Terminal/process management
- Git operations
- Settings persistence
- Secure credential storage
- IPC server

**Key Files:**
- `src/main/main.ts` - Application entry point
- `src/main/ipc/index.ts` - IPC handler setup
- `src/main/filesystem/` - File operations
- `src/main/terminal/` - Terminal management
- `src/main/git/` - Git integration
- `src/main/settings/` - Settings management
- `src/main/credentials/` - Secure storage

### 2. Frontend (React + TypeScript)

**Responsibilities:**
- UI rendering
- User interactions
- File editing with Monaco
- Agent chat interface
- Terminal UI
- State management

**Key Components:**
- `Layout` - Main application layout
- `FileExplorer` - File tree navigation
- `Editor` - Monaco-based code editor
- `Terminal` - Terminal UI
- `Agent` - AI chat interface

**State Management (Zustand Stores):**
- `appStore` - Global app state
- `editorStore` - Editor state
- `agentStore` - Agent state
- `fileSystemStore` - File system state

### 3. AI Agent Engine

**Responsibilities:**
- Agent loop orchestration
- Tool calling and execution
- Context management
- Permission validation
- Provider communication
- Error handling and recovery

**Key Classes:**
- `AgentEngine` - Main agent loop
- `ToolRegistry` - Tool registration and execution
- `ContextManager` - Context window management
- `PermissionManager` - Permission validation
- `ProviderManager` - Provider abstraction

### 4. Provider Layer

**Supported Providers:**
- OpenRouter (any supported model)
- NVIDIA NIM
- OpenAI-compatible APIs

**ProviderManager handles:**
- API communication
- Request/response formatting
- Error handling
- Token tracking
- Connection testing

## Data Flow

### File Reading
```
UI Request → IPC → Main Process → Filesystem → IPC → UI Update
```

### Agent Execution
```
User Prompt
    ↓
Agent Engine
    ↓
ProviderManager (API Call)
    ↓
Tool Calls
    ↓
ToolRegistry → FilesystemHandler/TerminalHandler
    ↓
Tool Results
    ↓
ContextManager (Update)
    ↓
UI Notification
    ↓
Loop or Complete
```

## Security Architecture

### IPC Security
- Preload script exposes only whitelisted APIs
- Context isolation enabled
- Sandboxing enabled
- No direct Node.js access from renderer

### Filesystem Security
- Path validation and normalization
- Workspace boundary enforcement
- Path traversal prevention
- Ignore patterns for sensitive directories

### Credential Security
- OS keychain/credential storage
- Never exposed to renderer
- Redacted in logs
- Never included in agent context

### Permission System
- Command classification (safe/moderate/dangerous)
- Configurable permission modes
- Session vs persistent permissions
- User confirmation for dangerous operations

## Performance Considerations

### Frontend
- Virtualized file tree for large projects
- Lazy loading of file contents
- Debounced search
- Efficient re-renders with Zustand

### Backend
- Streaming AI responses
- Incremental file operations
- Process isolation
- Memory management

### Context Management
- Token-based context windowing
- Automatic pruning of old context
- Selective file inclusion
- Conversation history limiting

## Extension Points

### Adding New Tools
1. Define tool in `src/agent/tools/definitions.ts`
2. Implement handler in `src/agent/tools/index.ts`
3. Register in AgentEngine
4. Add to ToolRegistry

### Adding New Providers
1. Create provider class extending ProviderManager
2. Implement `complete()` method
3. Handle provider-specific error codes
4. Register in settings UI

### Adding New Components
1. Create in `src/renderer/components/`
2. Use existing stores
3. Follow CSS naming conventions
4. Add TypeScript types

## Testing Strategy

### Unit Tests
- Agent tools
- Permission validation
- Context management
- Provider error handling

### Integration Tests
- IPC communication
- File operations
- Terminal execution
- Agent loop

### E2E Tests
- Full workflow testing
- UI interactions
- Agent completion

## Deployment

### Windows
```bash
npm run package:win
# Generates: ForgeCode-AI-Setup.exe
```

### macOS
```bash
npm run package:mac
# Generates: ForgeCode-AI.dmg
```

### Linux
```bash
npm run package:linux
# Generates: AppImage and .deb
```
