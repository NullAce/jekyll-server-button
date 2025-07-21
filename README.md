# Jekyll Server Button

A VS Code extension that adds convenient buttons to quickly start your Jekyll development server with a single click.

## Features

This extension provides multiple ways to start your Jekyll server:

- **Status Bar Button**: A "Jekyll Serve" button in the bottom status bar for quick access
- **Activity Bar Icon**: A dedicated server icon in the left sidebar that opens the Jekyll Server view
- **Command Palette**: Access via `Ctrl+Shift+P` → "Jekyll: Start Local Server"
- **View Container**: A dedicated Jekyll Server panel with multiple buttons:
  - Start Server (with default settings)
  - Start Server with Custom Settings (choose port, host, and additional arguments)
  - Stop Server
- **Customizable Settings**: Configure default port, host, and additional arguments
- **Terminal Management**: Automatically manages Jekyll server terminals

All methods run `bundle exec jekyll serve` in your workspace directory and open a terminal to show the server output.

> **Note**: This extension automatically detects your workspace folder and runs the Jekyll server from the correct directory.

## Requirements

To use this extension, you need:

- **Jekyll Project**: A valid Jekyll site with a `Gemfile` in your workspace

### Setup Instructions

1. Navigate to your Jekyll project directory
2. Ensure you have a `Gemfile` with Jekyll specified
3. Run `bundle install` to install dependencies
4. Open the project in VS Code
5. Use any of the Jekyll Server buttons to start your development server

## Extension Settings

This extension contributes the following settings:

- `jekyllServerButton.defaultPort`: Default port for Jekyll server (default: 4000)
- `jekyllServerButton.defaultHost`: Default host/address for Jekyll server (default: 127.0.0.1)
- `jekyllServerButton.additionalArgs`: Additional arguments to pass to Jekyll serve command (default: "")
- `jekyllServerButton.showInStatusBar`: Show Jekyll button in status bar (default: true)

You can access these settings via File → Preferences → Settings and search for "Jekyll Server Button".

## Known Issues

- The extension assumes your Jekyll project uses Bundler (requires a `Gemfile`)
- Currently only supports the standard `bundle exec jekyll serve` command

---

## Installation

1. Install the  `.vsix` file: `code --install-extension jekyll-server-button-1.0.0.vsix`

## Usage

After installation, you can start your Jekyll server using any of these methods:

1. **Status Bar**: Click the "Jekyll Serve" button in the bottom status bar
2. **Activity Bar**: Click the server icon in the left sidebar to open the Jekyll Server view, then:
   - Click the "Start Server" button to use default settings
   - Click the "Start Server with Custom Settings" button to specify port, host, and additional arguments
   - Click the "Stop Server" button to terminate the current Jekyll server
3. **Command Palette**: Press `Ctrl+Shift+P` and search for:
   - "Jekyll: Start Local Server" (uses default settings)
   - "Jekyll: Start Server with Custom Settings" (prompts for custom settings)
   - "Jekyll: Stop Server" (stops the current server)

### Custom Settings

When using "Start Server with Custom Settings", you'll be prompted to enter:

1. **Port**: The port number for the Jekyll server (1-65535)
2. **Host**: The host/address (e.g., 127.0.0.1, localhost, 0.0.0.0)
3. **Additional Arguments**: Optional Jekyll arguments (e.g., `--livereload --drafts`)

The extension will automatically open a terminal and run the appropriate `bundle exec jekyll serve` command with your specified settings.

## Following extension guidelines

This extension follows VS Code extension guidelines and best practices.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## For more information

* [VS Code Extension Development](https://code.visualstudio.com/api)
* [Jekyll Documentation](https://jekyllrb.com/docs/)
* [Bundler Documentation](https://bundler.io/)

**Happy Jekyll development!**
