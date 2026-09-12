# Security Policy

## Reporting Security Issues

If you discover a security vulnerability, please do NOT open a public issue. Instead:

1. Email security details to the repository maintainer
2. Include a clear description of the vulnerability
3. Include steps to reproduce if possible
4. Give us time to respond before public disclosure

## Security Measures

### API Key Storage

- **Method**: OS Secure Storage (Windows Credential Manager, macOS Keychain, Linux Secret Service)
- **Never Stored**: Plain text files, localStorage, or project files
- **Redacted**: In logs, error messages, and AI context

### Filesystem Security

- **Workspace Isolation**: Operations restricted to selected workspace
- **Path Validation**: All paths normalized and validated
- **Traversal Prevention**: `../` patterns blocked
- **Ignore Patterns**: Sensitive directories excluded by default

### Terminal Safety

- **Command Validation**: Commands classified as safe/moderate/dangerous
- **Permission System**: User confirmation for risky operations
- **Process Isolation**: Subprocess environment sanitized
- **No Shell Injection**: Command arguments properly escaped

### IPC Security

- **Preload Script**: Exposes only whitelisted APIs
- **Context Isolation**: Renderer isolated from main process
- **Sandboxing**: Enabled for renderer process
- **Type Safety**: All IPC calls strongly typed

### AI Provider Communication

- **HTTPS Only**: All API calls use encrypted transport
- **Credential Validation**: Keys validated before use
- **Request Redaction**: No keys in error messages
- **Rate Limiting**: Configured per provider

## Best Practices

When using ForgeCode AI:

1. **Never share API keys**
2. **Use environment-specific keys** where possible
3. **Rotate keys regularly**
4. **Keep ForgeCode updated**
5. **Review AI-generated code** before committing
6. **Audit terminal output** for sensitive information

## Known Limitations

- Workspace must be on local filesystem
- No encryption at rest (use OS-level disk encryption)
- Terminal access requires trust in executed code
- AI context may include file contents (respect privacy)

## Security Updates

Follow releases and security advisories at:
https://github.com/atharvaphadnis-ai/forgecode-ai/releases

---

**Made by Atharva Phadnis.**
