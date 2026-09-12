# Contributing to ForgeCode AI

Thank you for your interest in contributing to ForgeCode AI!

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/forgecode-ai.git
   cd forgecode-ai
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start development:
   ```bash
   npm run dev
   ```

## Development

### Project Structure

- `src/main/` - Electron main process
- `src/renderer/` - React frontend
- `src/agent/` - AI agent engine
- `src/shared/` - Shared types and constants

### Code Standards

- Use TypeScript for all code
- Follow ESLint configuration
- Format code with Prettier
- Write tests for new features
- Update documentation

### Running Tests

```bash
npm test
npm run test:watch
```

### Linting and Formatting

```bash
npm run lint
npm run format
```

## Commit Message Guidelines

- Use clear, descriptive commit messages
- Reference issues when applicable
- Format: `type(scope): description`

Examples:
- `feat(agent): add error recovery loop`
- `fix(terminal): handle process exit codes`
- `docs(readme): update installation steps`

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes
3. Push to your fork
4. Open a pull request with a clear description
5. Address any review feedback

## Reporting Issues

- Check existing issues first
- Provide clear reproduction steps
- Include environment information
- Attach logs if relevant

## Feature Requests

- Describe the desired functionality
- Explain the use case
- Provide mockups if applicable

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Made by Atharva Phadnis.**
