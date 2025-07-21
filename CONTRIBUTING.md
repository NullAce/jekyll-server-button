# Contributing to Jekyll Server Button

Thank you for considering contributing to Jekyll Server Button! This document provides guidelines for contributing to this VS Code extension.

## Development Setup

1. **Prerequisites**
   - Node.js (v14 or higher)
   - VS Code
   - Git

2. **Clone and Setup**
   ```bash
   git clone https://github.com/your-username/jekyll-server-button.git
   cd jekyll-server-button
   npm install
   ```

3. **Development Workflow**
   - Open the project in VS Code
   - Press `F5` to launch Extension Development Host
   - Make changes to the code
   - Reload the Extension Development Host (`Ctrl+R` or `Cmd+R`)

## Building and Testing

- **Build**: `npm run compile`
- **Watch Mode**: `npm run watch`
- **Lint**: `npm run lint`
- **Package**: `npm run package`

## Project Structure

```
├── src/
│   ├── extension.ts       # Main extension logic
│   └── test/             # Test files
├── package.json          # Extension manifest
├── README.md            # Documentation
├── CHANGELOG.md         # Version history
└── esbuild.js          # Build configuration
```

## Making Changes

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Test thoroughly** using the Extension Development Host
5. **Update documentation** if necessary
6. **Commit your changes**: `git commit -m "Add feature: your feature description"`
7. **Push to your fork**: `git push origin feature/your-feature-name`
8. **Create a Pull Request**

## Code Style

- Use TypeScript
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure all linting passes (`npm run lint`)

## Feature Requests

Before implementing new features:

1. Check existing issues and discussions
2. Open an issue to discuss the feature
3. Wait for maintainer feedback before starting work

## Bug Reports

When reporting bugs, include:

- VS Code version
- Extension version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs if applicable

## Pull Request Guidelines

- Include a clear description of changes
- Reference any related issues
- Update README.md if necessary
- Ensure all tests pass
- Follow the existing code style

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
