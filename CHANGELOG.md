# Change Log

# Change Log

All notable changes to the "jekyll-server-button" extension will be documented in this file.

## [0.0.1] - 2025-07-21

### Added
- Initial release of Jekyll Server Button extension
- Status bar button for quick Jekyll server access
- Activity bar icon with dedicated Jekyll Server view
- Command palette integration with multiple commands:
  - `Jekyll: Start Local Server` - Start with default settings
  - `Jekyll: Start Server with Custom Settings` - Choose port, host, and additional arguments
  - `Jekyll: Stop Server` - Stop the current Jekyll server
- Configurable extension settings:
  - `jekyllServerButton.defaultPort` - Default port (4000)
  - `jekyllServerButton.defaultHost` - Default host (127.0.0.1)
  - `jekyllServerButton.additionalArgs` - Additional Jekyll arguments
  - `jekyllServerButton.showInStatusBar` - Show/hide status bar button
- Automatic workspace directory detection
- Terminal management for Jekyll server processes
- Support for custom Jekyll serve arguments (--livereload, --drafts, etc.)

### Features
- Multiple ways to start Jekyll server (status bar, activity bar, command palette)
- Customizable server settings with validation
- Clean terminal management (automatically closes previous server when starting new one)
- User-friendly input prompts for custom settings
- Informational messages for server status

### Technical
- TypeScript implementation
- ESLint code linting
- esbuild for efficient bundling
- Comprehensive test setup
- CI/CD workflow for automated testing and publishing