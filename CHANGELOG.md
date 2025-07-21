# Change Log

All notable changes to the "jekyll-server-button" extension will be documented in this file.

## [1.0.0] - 2025-07-21

### Added
- � **Initial Release** - Jekyll Server Button extension for VS Code
- 📱 **Activity Bar Integration** - Dedicated Jekyll Server view in the left sidebar
- ⚡ **Status Bar Button** - Quick access Jekyll server control
- 🎛️ **Configurable Settings** - Easily editable port, host, and additional arguments
- 🔧 **Command Palette Integration** - Full command palette support
- 📊 **Smart Terminal Management** - Automatic cleanup and management of Jekyll server processes

### Features
- **Start/Stop Server**: Simple one-click Jekyll server control
- **Editable Settings**: Click to edit port (default: 4000), host (default: 127.0.0.1), and additional arguments
- **Workspace Settings**: Settings are saved per workspace for project-specific configurations
- **Visual Feedback**: Enhanced UI with emojis and color-coded icons
- **Automatic Detection**: Automatically detects workspace directory for Jekyll server startup
- **Terminal Integration**: Creates dedicated terminal for Jekyll server with proper naming

### Commands
- `Jekyll: Start Local Server` - Start Jekyll server with current settings
- `Jekyll: Stop Server` - Stop the running Jekyll server
- Individual edit commands for port, host, and additional arguments

### Configuration
- `jekyllServerButton.defaultPort` - Default port for Jekyll server (1-65535)
- `jekyllServerButton.defaultHost` - Default host/address for Jekyll server  
- `jekyllServerButton.additionalArgs` - Additional arguments to pass to Jekyll serve command
- `jekyllServerButton.showInStatusBar` - Show/hide status bar button

### Technical Details
- TypeScript implementation with full type safety
- ESLint code linting and esbuild bundling
- Comprehensive error handling and validation
- Cross-platform support (Windows, macOS, Linux)

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