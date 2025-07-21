import * as vscode from "vscode";

let currentTerminal: vscode.Terminal | undefined;

export function activate(context: vscode.ExtensionContext) {
  // Register Command Palette commands
  const startJekyllCommand = vscode.commands.registerCommand(
    "jekyll-server-button.startServer",
    () => startJekyllServer()
  );

  const startJekyllCustomCommand = vscode.commands.registerCommand(
    "jekyll-server-button.startServerCustom",
    () => startJekyllServerCustom()
  );

  const stopJekyllCommand = vscode.commands.registerCommand(
    "jekyll-server-button.stopServer",
    () => stopJekyllServer()
  );

  context.subscriptions.push(
    startJekyllCommand,
    startJekyllCustomCommand,
    stopJekyllCommand
  );

  // Create status bar item based on settings
  updateStatusBar();

  // Listen for configuration changes
  vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration("jekyllServerButton.showInStatusBar")) {
      updateStatusBar();
    }
  });

  function updateStatusBar() {
    const config = vscode.workspace.getConfiguration("jekyllServerButton");
    const showInStatusBar = config.get<boolean>("showInStatusBar", true);

    if (showInStatusBar) {
      const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left
      );
      statusBarItem.text = "$(server) Jekyll Serve";
      statusBarItem.tooltip = "Click to start Jekyll server";
      statusBarItem.command = "jekyll-server-button.startServer";
      statusBarItem.show();
      context.subscriptions.push(statusBarItem);
    }
  }

  function startJekyllServer() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      vscode.window.showErrorMessage("No workspace folder found");
      return;
    }

    const config = vscode.workspace.getConfiguration("jekyllServerButton");
    const port = config.get<number>("defaultPort", 4000);
    const host = config.get<string>("defaultHost", "127.0.0.1");
    const additionalArgs = config.get<string>("additionalArgs", "");

    startServer(workspaceFolder, host, port, additionalArgs);
  }

  async function startJekyllServerCustom() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      vscode.window.showErrorMessage("No workspace folder found");
      return;
    }

    const config = vscode.workspace.getConfiguration("jekyllServerButton");
    const defaultPort = config.get<number>("defaultPort", 4000);
    const defaultHost = config.get<string>("defaultHost", "127.0.0.1");

    // Get custom port
    const portInput = await vscode.window.showInputBox({
      prompt: "Enter port number",
      value: defaultPort.toString(),
      validateInput: (value) => {
        const port = parseInt(value);
        if (isNaN(port) || port < 1 || port > 65535) {
          return "Please enter a valid port number (1-65535)";
        }
        return null;
      },
    });

    if (!portInput) {
      return;
    }

    // Get custom host
    const hostInput = await vscode.window.showInputBox({
      prompt: "Enter host/address",
      value: defaultHost,
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return "Please enter a valid host address";
        }
        return null;
      },
    });

    if (!hostInput) {
      return;
    }

    // Get additional arguments
    const argsInput = await vscode.window.showInputBox({
      prompt: "Additional Jekyll arguments (optional)",
      value: "",
      placeHolder: "e.g., --livereload --drafts",
    });

    const port = parseInt(portInput);
    const host = hostInput.trim();
    const additionalArgs = argsInput?.trim() || "";

    startServer(workspaceFolder, host, port, additionalArgs);
  }

  function startServer(
    workspaceFolder: vscode.WorkspaceFolder,
    host: string,
    port: number,
    additionalArgs: string
  ) {
    // Close existing terminal if running
    if (currentTerminal) {
      currentTerminal.dispose();
    }

    // Build Jekyll command
    let command = `bundle exec jekyll serve --host ${host} --port ${port}`;
    if (additionalArgs) {
      command += ` ${additionalArgs}`;
    }

    // Create terminal in the workspace directory
    currentTerminal = vscode.window.createTerminal({
      name: `Jekyll Server (${host}:${port})`,
      cwd: workspaceFolder.uri.fsPath,
      shellPath: process.platform === "win32" ? "powershell.exe" : "bash",
    });

    // Send the Jekyll serve command
    currentTerminal.sendText(command);
    currentTerminal.show();

    vscode.window.showInformationMessage(
      `Jekyll server starting on ${host}:${port}...`
    );
  }

  function stopJekyllServer() {
    if (currentTerminal) {
      currentTerminal.dispose();
      currentTerminal = undefined;
      vscode.window.showInformationMessage("Jekyll server stopped");
    } else {
      vscode.window.showWarningMessage("No Jekyll server terminal found");
    }
  }
}

export function deactivate() {
  if (currentTerminal) {
    currentTerminal.dispose();
  }
}
