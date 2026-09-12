# Development Setup Guide

## Quick Fix for npm install Issues

If you encountered connection errors during `npm install`, follow these steps:

### Step 1: Clean Installation

```bash
# Close any running npm/node processes
taskkill /F /IM node.exe

# Remove old installation
rmdir /s /q node_modules
del package-lock.json

# Clear npm cache
npm cache clean --force
```

### Step 2: Retry Installation

**Option A: Standard Install (Recommended)**
```bash
npm install --legacy-peer-deps
```

**Option B: With Retry Logic**
```bash
npm install --legacy-peer-deps --verbose
```

**Option C: Use Alternative Mirror (if in Asia/China)**
```bash
npm config set registry https://registry.npmmirror.com
npm install --legacy-peer-deps
npm config set registry https://registry.npmjs.org/
```

**Option D: Use Yarn Instead**
```bash
# Install Yarn globally first
npm install -g yarn

# Then use Yarn to install
yarn install
```

### Step 3: Verify Installation

After successful installation:

```bash
# Check if node_modules exists
dir node_modules

# Verify key packages
npm list electron
npm list vite
npm list react
```

## Running ForgeCode AI

### Method 1: Development Mode (Recommended)

```bash
# Terminal 1 - Start Electron
npm run start:dev

# Terminal 2 - Start Vite dev server
npm run dev:renderer
```

### Method 2: Single Command (Windows/macOS)

```bash
# This runs both processes in parallel
npm run dev
```

**Note**: On Windows, you may need to use a tool like `concurrently`:

```bash
# Install concurrently
npm install --save-dev concurrently

# Update dev script in package.json:
# "dev": "concurrently \"npm run dev:main\" \"npm run dev:renderer\""
```

### Method 3: Step-by-Step Manual

```bash
# Step 1: Build TypeScript
npm run build:main

# Step 2: Start Vite
npm run dev:renderer

# Step 3: In another terminal, start Electron
electron .
```

## Troubleshooting

### Issue: "vite is not recognized"

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue: "electron is not recognized"

```bash
# Install electron locally
npm install --save-dev electron

# Or use npx
npx electron .
```

### Issue: "Cannot find module '@/shared/types'"

Make sure you have the shared types file:

```bash
# Check if file exists
dir src\shared\types.ts

# If not, create it:
mkdir src\shared
echo // shared types > src\shared\types.ts
```

### Issue: Port 5173 Already in Use

```bash
# Use a different port
npm run dev:renderer -- --port 5174
```

### Issue: Connection Refused on IPC

Make sure Electron is running first, then try again:

```bash
# Kill all node processes
taskkill /F /IM node.exe

# Start fresh
npm run dev
```

## Building for Production

```bash
# Build all components
npm run build

# Package for Windows
npm run package:win

# Package for macOS
npm run package:mac

# Package for Linux
npm run package:linux
```

The installer will be in the `release/` directory.

## Environment Setup

### Windows Users

1. Ensure Node.js is in PATH:
   ```bash
   node --version
   npm --version
   ```

2. If command not found, add to PATH:
   - Right-click "This PC" → Properties
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Add Node.js installation path to PATH

### macOS Users

```bash
# If using Homebrew
brew install node

# Verify installation
node --version
npm --version
```

### Linux Users

```bash
# Ubuntu/Debian
sudo apt-get install nodejs npm

# Fedora
sudo dnf install nodejs npm

# Verify installation
node --version
npm --version
```

## Next Steps

1. **Configure AI Provider**
   - Open Settings (Ctrl+,)
   - Go to AI Provider tab
   - Enter your API key
   - Test connection

2. **Open Workspace**
   - Click "Open Workspace"
   - Select a project folder
   - Start editing files

3. **Read Documentation**
   - Check README.md for features
   - Review ARCHITECTURE.md for system design
   - See QUICKSTART.md for quick reference

## Getting Help

If you still have issues:

1. Check INSTALLATION_TROUBLESHOOTING.md
2. Review error logs in `npm-cache/_logs/`
3. Open an issue on GitHub with:
   - Your OS and Node.js version
   - Full error message
   - Steps you've already tried

---

**Made by Atharva Phadnis.**
