# ForgeCode AI - Quick Start Guide

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/atharvaphadnis-ai/forgecode-ai.git
cd forgecode-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure AI Provider

Before running the application, you need to configure your AI provider:

#### Option A: OpenRouter

1. Get your API key from https://openrouter.ai
2. Keep it handy for configuration

#### Option B: NVIDIA NIM

1. Get your API key from https://build.nvidia.com
2. Keep it handy for configuration

### 4. Start Development

```bash
npm run dev
```

The application will open automatically.

## First Run

1. **Configure AI Provider**
   - Go to Settings (top menu)
   - Navigate to AI Provider tab
   - Select your provider (OpenRouter or NVIDIA NIM)
   - Enter API URL and API Key
   - Click "Test Connection"

2. **Open Workspace**
   - Click "Open Workspace" button
   - Select a local folder
   - The file tree will populate

3. **Start Building**
   - Describe what you want in the AI Agent panel
   - The agent will analyze and create files
   - Watch the terminal for real-time output

## Building for Production

### Windows

```bash
npm run build
npm run package:win
```

Generates: `ForgeCode-AI-Setup.exe`

### macOS

```bash
npm run build
npm run package:mac
```

Generates: `ForgeCode-AI.dmg`

### Linux

```bash
npm run build
npm run package:linux
```

Generates: `ForgeCode-AI.AppImage` and `.deb` file

## Environment

No environment variables needed in the UI. All configuration is done through the Settings interface.

### Secure Storage

- API keys are stored securely using OS keychain
- Never stored in plain text
- Never logged or exposed

## Troubleshooting

### "Cannot find module"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

The default dev port is 5173. If it's in use:

```bash
npm run dev -- --port 5174
```

### Electron Not Starting

Ensure you have the latest Node.js version:

```bash
node --version  # Should be 18.0.0+
```

## Next Steps

- Read [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
- Review [README.md](README.md) for full feature documentation

---

**ForgeCode AI - Describe it. Forge it. Ship it.**

**Made by Atharva Phadnis.**
