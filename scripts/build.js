#!/usr/bin/env node

// Simple build script for development
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0] || 'dev';

const commands = {
  dev: () => {
    console.log('Starting development server...');
    execSync('vite', { stdio: 'inherit' });
  },
  build: () => {
    console.log('Building for production...');
    execSync('tsc && vite build', { stdio: 'inherit' });
  },
  package: () => {
    console.log('Packaging application...');
    execSync('npm run build && electron-builder', { stdio: 'inherit' });
  },
  'package:win': () => {
    console.log('Building Windows installer...');
    execSync('npm run build && electron-builder --win', { stdio: 'inherit' });
  },
  lint: () => {
    console.log('Linting code...');
    execSync('eslint . --ext .ts,.tsx', { stdio: 'inherit' });
  },
  format: () => {
    console.log('Formatting code...');
    execSync('prettier --write "src/**/*.{ts,tsx,css,json}"', { stdio: 'inherit' });
  },
  test: () => {
    console.log('Running tests...');
    execSync('vitest', { stdio: 'inherit' });
  },
};

if (commands[command]) {
  try {
    commands[command]();
  } catch (error) {
    process.exit(1);
  }
} else {
  console.error(`Unknown command: ${command}`);
  console.log('Available commands:', Object.keys(commands).join(', '));
  process.exit(1);
}
