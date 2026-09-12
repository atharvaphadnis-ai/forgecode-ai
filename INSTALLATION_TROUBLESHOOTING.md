# ForgeCode AI - Installation Troubleshooting Guide

## Network Issues with npm install

### Problem: ECONNRESET when downloading Electron

This commonly happens when:
- Network connection drops during large file downloads
- ISP/firewall blocking downloads
- npm registry timeouts
- Electron mirror server is slow

### Solution 1: Retry with Increased Timeout

```bash
# Clear npm cache
npm cache clean --force

# Install with longer timeout
npm install --no-optional --legacy-peer-deps
```

### Solution 2: Use Alternative npm Registry

```bash
# Use Aliyun mirror (good for China/Asia)
npm config set registry https://registry.npmmirror.com
npm install

# Or use Taobao mirror
npm config set registry https://registry.taobao.org
npm install

# Reset to default
npm config set registry https://registry.npmjs.org/
```

### Solution 3: Download Electron Separately

```bash
# Set electron mirror
set ELECTRON_MIRROR=https://github.com/electron/electron/releases/download/
npm install

# Or for Windows with PowerShell
$env:ELECTRON_MIRROR="https://github.com/electron/electron/releases/download/"
npm install
```

### Solution 4: Use npm ci Instead

```bash
# Clean install is sometimes more reliable
npm ci --prefer-offline --no-audit
```

### Solution 5: Manual Electron Installation

If npm keeps failing:

```bash
# Install without optional dependencies first
npm install --no-optional --ignore-scripts

# Then install electron separately
npm install electron --force

# Install remaining dependencies
npm install
```

## Windows-Specific Issues

### Issue: EPERM (Operation Not Permitted)

This is a file lock issue on Windows:

```bash
# Close all Node processes
taskkill /F /IM node.exe

# Clear node_modules
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

### Issue: vite Not Found After Install

This means installation wasn't fully successful:

```bash
# Reinstall all dependencies
npm install --force

# Or use npm ci
npm ci --prefer-offline
```

## Verify Installation Success

After `npm install` completes, verify:

```bash
# Check node_modules exists
ls node_modules\electron

# Check package versions
npm list electron
npm list vite

# Verify build files
ls node_modules\.bin
```

## If Installation Still Fails

### Option 1: Use npm Install with Retries

```bash
for /L %i in (1,1,5) do (
  npm install && goto :success
  timeout /t 30
)
:success
echo Installation successful!
```

### Option 2: Install Step by Step

```bash
# Core dependencies
npm install react react-dom zustand axios

# Development tools
npm install --save-dev vite @vitejs/plugin-react typescript

# Electron and build
npm install --save-dev electron electron-builder

# Linting and formatting
npm install --save-dev eslint prettier

# Remaining dependencies
npm install
```

### Option 3: Use Yarn Instead

If npm continues to fail, try Yarn:

```bash
# Install Yarn if not already
npm install -g yarn

# Use Yarn to install
yarn install

# Run development
yarn dev
```

### Option 4: Use PNPM Instead

```bash
# Install pnpm if not already
npm install -g pnpm

# Use pnpm to install
pnpm install

# Run development
pnpm dev
```

## After Successful Installation

Once `npm install` completes successfully:

```bash
# Start development server
npm run dev

# Or build for production
npm run build
npm run package:win
```

## Alternative: Docker Installation

If npm continues to fail, use Docker:

```dockerfile
FROM node:18-latest

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

CMD ["npm", "run", "dev"]
```

Build and run:

```bash
docker build -t forgecode-ai .
docker run -it forgecode-ai
```

## Checking Network Connectivity

```bash
# Test npm registry connectivity
ping registry.npmjs.org

# Test GitHub connectivity (for Electron downloads)
ping github.com

# Test specific npm package download
npm view electron version
```

## Windows Defender/Antivirus Issues

If installation is slow or fails:

1. Add project folder to antivirus exclusions
2. Temporarily disable real-time scanning
3. Check Windows Defender quarantine for blocked files

## Node.js Version Issues

Ensure you have the correct Node.js version:

```bash
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 9.0.0 or higher

# If too old, download from https://nodejs.org/
```

## Clean Reinstall (Nuclear Option)

```bash
# Remove all node-related cache
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force

# Remove npm global cache
del /s /q %appdata%\npm-cache

# Reinstall from scratch
npm install --verbose
```

## Check for Disk Space

```bash
# Check available disk space
wmic logicaldisk get name,size,freespace

# Node modules can take 1-2 GB
```

## Getting Help

If installation still fails:

1. Check the full log:
   ```bash
   npm install --verbose > install.log 2>&1
   type install.log
   ```

2. Open an issue with:
   - Your Node.js and npm versions
   - Full error log
   - Your OS and network setup
   - Exact command you ran

3. Check existing issues: https://github.com/atharvaphadnis-ai/forgecode-ai/issues

---

**ForgeCode AI - Describe it. Forge it. Ship it.**

**Made by Atharva Phadnis.**
