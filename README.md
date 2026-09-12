# ForgeCode AI

**Describe it. Forge it. Ship it.**

A production-quality autonomous AI coding agent and lightweight desktop IDE that builds real projects on your machine.

Select a folder, describe the application you want, and ForgeCode AI creates complete, functional projects across multiple files and folders with real-time error detection, compilation, and automatic fixing.

## Features

### Core Development Environment
- **Monaco Editor** with syntax highlighting, IntelliSense, and multi-tab support
- **Real-time file explorer** with drag-drop, context menus, and Git status indicators
- **Integrated terminal** with multiple tabs, ANSI colors, and process management
- **Split editor**, find/replace, code folding, and bracket matching
- **Light and dark themes** with professional IDE aesthetics

### AI Coding Agent
- **Autonomous agent loop**: understand → plan → read → create → edit → test → fix → iterate
- **Tool-based architecture** with workspace, terminal, and development tools
- **Real file operations** on your selected workspace
- **Real terminal execution** with error inspection
- **Error detection and repair** with iterative compilation
- **Multi-file orchestration** across entire projects
- **Streaming responses** for real-time feedback
- **Permission system** for safe operation

### Provider Support
- **OpenRouter** with any supported model
- **NVIDIA NIM** with full API customization
- **OpenAI-compatible** provider abstraction
- **Model configuration** with temperature, token limits, and timeouts
- **Connection testing** with detailed error messages
- **Secure credential storage** using OS keychain

### Advanced Features
- **Project detection** (Node.js, Python, Rust, Go, Java, Arduino, etc.)
- **Dependency management** (npm, pnpm, yarn, bun, pip, poetry, cargo, etc.)
- **Git integration** with status, diff, commit, and branch operations
- **Checkpoints/snapshots** before major tasks for easy recovery
- **Diff viewer** with accept/reject for AI modifications
- **Image attachments** with vision model support
- **Global project search** with regex and filtering
- **Multi-task conversation** history management
- **Background tasks** with notifications
- **Dev server preview** detection and embedding
- **Permission levels** for safe/moderate/dangerous commands

## System Requirements

- **OS**: Windows 10+ (primary target), macOS 11+, Linux
- **Node.js**: 18+
- **RAM**: 4GB minimum, 8GB+ recommended
- **Disk**: 500MB for application
- **Internet**: Required for AI provider APIs (local mode fallback supported)

## Installation

### Prerequisites
```bash
node --version  # 18.0.0 or higher
npm --version   # 9.0.0 or higher
```

### From Source

```bash
git clone https://github.com/atharvaphadnis-ai/forgecode-ai.git
cd forgecode-ai
npm install
```

### Development Mode

```bash
npm run dev
```

Starts the Electron development environment with hot-reload.

### Production Build

```bash
npm run build
npm run package
```

Creates optimized production build.

### Windows Installer

```bash
npm run package:win
```

Generates `ForgeCode-AI-Setup.exe` for Windows distribution.

## Configuration

### Step 1: Launch Application

```bash
npm run dev
```

### Step 2: Configure AI Provider

1. Open **Settings** (Ctrl+,)
2. Navigate to **AI** section
3. Select provider:
   - **OpenRouter** or **NVIDIA NIM**
4. Enter credentials securely
5. Click **Test Connection**

#### OpenRouter Configuration

```
Provider: OpenRouter
API URL: https://openrouter.ai/api/v1
API Key: [Your OpenRouter API key]
Model: openrouter/meta-llama/llama-2-70b-chat
```

Get your API key at: https://openrouter.ai

#### NVIDIA NIM Configuration

```
Provider: NVIDIA NIM
API URL: https://integrate.api.nvidia.com/v1
API Key: [Your NVIDIA API key]
Model: meta/llama-2-70b-chat-hf
```

Get your API key at: https://build.nvidia.com

### Step 3: Open Workspace

1. Click **Open Workspace** or Ctrl+O
2. Select a local folder
3. File explorer populates with project structure
4. Ready to code!

## Usage

### Create New Project

```
User: "Create a React dashboard with dark mode and real-time charts."

AI Agent:
→ Creates project structure
→ Configures package.json
→ Installs dependencies
→ Creates components
→ Runs build
→ Detects and fixes errors
→ Reports completion
```

### Chat with Codebase

```
User: "Where is authentication handled? Add OAuth."

AI Agent:
→ Searches project
→ Analyzes existing auth
→ Creates OAuth implementation
→ Integrates with existing code
→ Tests
```

### Fix Errors

Click **Fix with AI** on any problem in the Problems panel.

Agent receives error context and fixes it automatically.

### Inline Editing

Select code, press `Ctrl+K`, describe the change.

Example: "Make this async and add error handling"

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+P` | Quick Open |
| `Ctrl+Shift+P` | Command Palette |
| `Ctrl+K` | AI Inline Edit |
| `Ctrl+S` | Save |
| `Ctrl+Shift+F` | Global Search |
| `` Ctrl+` `` | Terminal |
| `Ctrl+B` | Toggle Sidebar |
| `Ctrl+Shift+A` | Open Agent Panel |
| `Ctrl+W` | Close Tab |
| `Ctrl+Tab` | Switch Tab |

## Architecture

```
ForgeCode AI
│
├── Desktop Runtime (Electron/Tauri)
│   ├── Main Process (Node.js)
│   ├── Secure IPC layer
│   ├── Filesystem operations
│   └── Terminal management
│
├── Frontend (React + TypeScript)
│   ├── Monaco Editor
│   ├── File Explorer
│   ├── Terminal UI
│   ├── Agent Panel
│   └── Settings
│
├── AI Agent Engine (TypeScript)
│   ├── Tool Registry
│   ├── Context Manager
│   ├── Permissions System
│   ├── Agent Loop
│   └── Error Recovery
│
└── Provider Layer
    ├── OpenRouter
    ├── NVIDIA NIM
    └── OpenAI-compatible
```

## Project Structure

```
forgecode-ai/
├── README.md
├── LICENSE
├── package.json
├── tsconfig.json
├── vite.config.ts
│
├── src/
│   ├── main/                    # Electron main process
│   │   ├── main.ts
│   │   ├── preload.ts
│   │   ├── ipc/                # IPC handlers
│   │   ├── filesystem/         # File operations
│   │   ├── terminal/           # Terminal management
│   │   ├── process/            # Process management
│   │   ├── git/                # Git operations
│   │   └── security/           # Validation & safety
│   │
│   ├── renderer/                # React frontend
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   ├── FileExplorer/
│   │   │   ├── Editor/
│   │   │   ├── Terminal/
│   │   │   ├── Agent/
│   │   │   ├── Chat/
│   │   │   ├── Diff/
│   │   │   ├── Problems/
│   │   │   ├── Git/
│   │   │   ├── Settings/
│   │   │   └── CommandPalette/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── services/
│   │   ├── types/
│   │   └── styles/
│   │
│   ├── agent/                   # AI Agent engine
│   │   ├── AgentEngine.ts
│   │   ├── AgentLoop.ts
│   │   ├── ToolRegistry.ts
│   │   ├── ToolExecutor.ts
│   │   ├── ContextManager.ts
│   │   ├── Planner.ts
│   │   ├── Permissions.ts
│   │   ├── providers/
│   │   │   ├── OpenRouterProvider.ts
│   │   │   ├── NvidiaNimProvider.ts
│   │   │   └── OpenAICompatibleProvider.ts
│   │   └── tools/
│   │       ├── WorkspaceTools.ts
│   │       ├── TerminalTools.ts
│   │       └── ProjectTools.ts
│   │
│   └── shared/
│       ├── types/
│       ├── constants/
│       └── schemas/
│
├── public/
│   ├── icons/
│   └── index.html
│
└── tests/
    ├── agent/
    ├── filesystem/
    └── providers/
```

## Security

### API Keys
- **Never exposed** in frontend source code
- **Never logged** or displayed
- **Stored securely** using OS credential manager
- **Validated** before use
- **Redacted** in logs and error messages

### Filesystem Access
- **Restricted** to selected workspace
- **Path traversal** prevented with normalization
- **Permission system** for destructive operations
- **User confirmation** for dangerous commands

### Terminal Execution
- **Sandboxed** to workspace directory
- **Command validation** before execution
- **Safe/moderate/dangerous** permission levels
- **Process isolation** and termination capability

### Environment
- **API keys** never passed to subprocess environment
- **Secrets** never included in tool context
- **Logs** automatically redacted
- **Prompts** never contain credentials

## Troubleshooting

### "Authentication failed"
- Verify API key is correct
- Check provider API URL
- Ensure network connectivity
- Test connection in Settings

### "Rate limited"
- Wait before making new requests
- Switch to different model if available
- Check provider account for usage limits

### "Build failed"
- Check Terminal panel for error details
- Verify dependencies are installed
- Enable AI auto-fix in Settings
- Manually inspect relevant files

### "Workspace not found"
- Verify folder path exists
- Check folder permissions
- Ensure sufficient disk space
- Try opening a different folder

## Development

### Prerequisites
```bash
Node.js 18+
npm 9+
git
```

### Setup
```bash
npm install
npm run dev
```

### Building
```bash
npm run build       # Production build
npm run package     # Electron package
npm run package:win # Windows installer
```

### Testing
```bash
npm test
npm run test:watch
```

### Linting
```bash
npm run lint
npm run format
```

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a pull request
5. Include tests for new functionality

## License

MIT License - see LICENSE file for details

## About

**Made by Atharva Phadnis.**

ForgeCode AI is built with:
- Electron
- React + TypeScript
- Monaco Editor
- Tauri (alternative implementation)
- OpenRouter & NVIDIA NIM APIs
- Zustand for state management
- Tailwind CSS for styling

## Roadmap

- [ ] Local LLM support (Ollama, llama.cpp)
- [ ] Advanced refactoring tools
- [ ] Multi-workspace support
- [ ] Collaborative editing
- [ ] Plugin system
- [ ] Custom agent personas
- [ ] Extended language support
- [ ] Performance profiling tools
- [ ] Database visualization
- [ ] API testing tools

## Support

For issues, questions, or feature requests:
- GitHub Issues: https://github.com/atharvaphadnis-ai/forgecode-ai/issues
- Documentation: See docs/ folder
- Email: Contact through GitHub profile

---

**ForgeCode AI - Describe it. Forge it. Ship it.**