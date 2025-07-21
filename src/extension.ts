import * as vscode from "vscode";

let currentTerminal: vscode.Terminal | undefined;
let isServerRunning = false;
let statusBarItem: vscode.StatusBarItem | undefined;
let provider: JekyllServerProvider;

interface JekyllServerItem {
  label: string;
  description?: string;
  value?: string | number;
  type: "setting" | "action" | "separator";
  command?: string;
  editable?: boolean;
  settingKey?: string;
}

class JekyllServerProvider
  implements vscode.TreeDataProvider<JekyllServerItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    JekyllServerItem | undefined | null | void
  > = new vscode.EventEmitter<JekyllServerItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    JekyllServerItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: JekyllServerItem): vscode.TreeItem {
    const item = new vscode.TreeItem(
      element.label,
      vscode.TreeItemCollapsibleState.None
    );

    item.description = element.description;
    item.tooltip = element.description;

    if (element.command) {
      item.command = { command: element.command, title: element.label };
    }

    // Enhanced styling for different item types
    if (element.type === "action") {
      if (element.command === "jekyll-server-button.startServer") {
        item.iconPath = new vscode.ThemeIcon(
          "play",
          new vscode.ThemeColor("testing.iconPassed")
        );
      } else if (element.command === "jekyll-server-button.stopServer") {
        item.iconPath = new vscode.ThemeIcon(
          "stop",
          new vscode.ThemeColor("testing.iconFailed")
        );
      }
    } else if (element.type === "setting") {
      item.iconPath = new vscode.ThemeIcon(
        "settings-gear",
        new vscode.ThemeColor("symbolIcon.colorForeground")
      );
      item.contextValue = "settingItem";
    } else if (element.type === "separator") {
      item.iconPath = new vscode.ThemeIcon("dash");
      item.description = "────────────────";
    }

    return item;
  }

  getChildren(element?: JekyllServerItem): Thenable<JekyllServerItem[]> {
    const config = vscode.workspace.getConfiguration("jekyllServerButton");

    const items: JekyllServerItem[] = [
      {
        label: "Start Server",
        description: "▶️ Start Jekyll server",
        type: "action",
        command: "jekyll-server-button.startServer",
      },
      {
        label: "Stop Server",
        description: "⏹️ Stop Jekyll server",
        type: "action",
        command: "jekyll-server-button.stopServer",
      },
      {
        label: "",
        type: "separator",
      },
      {
        label: "Port",
        description: `📡 ${config.get<number>("defaultPort", 4000)}`,
        type: "setting",
        editable: true,
        settingKey: "defaultPort",
        command: "jekyll-server-button.editPort",
      },
      {
        label: "Host",
        description: `🌐 ${config.get<string>("defaultHost", "127.0.0.1")}`,
        type: "setting",
        editable: true,
        settingKey: "defaultHost",
        command: "jekyll-server-button.editHost",
      },
      {
        label: "Additional Args",
        description: `⚙️ ${
          config.get<string>("additionalArgs", "") || "(none)"
        }`,
        type: "setting",
        editable: true,
        settingKey: "additionalArgs",
        command: "jekyll-server-button.editArgs",
      },
    ];

    return Promise.resolve(items);
  }
}

// Command functions moved outside of activate to be accessible
async function editSetting(settingKey: string, prompt: string) {
  const config = vscode.workspace.getConfiguration("jekyllServerButton");
  const currentValue = config.get(settingKey);

  let validateInput: ((value: string) => string | null) | undefined;
  let placeholder = "";

  if (settingKey === "defaultPort") {
    placeholder = "e.g., 4000";
    validateInput = (value: string) => {
      const port = parseInt(value);
      if (isNaN(port) || port < 1 || port > 65535) {
        return "Please enter a valid port number (1-65535)";
      }
      return null;
    };
  } else if (settingKey === "defaultHost") {
    placeholder = "e.g., 127.0.0.1 or localhost";
    validateInput = (value: string) => {
      if (!value || value.trim().length === 0) {
        return "Please enter a valid host address";
      }
      return null;
    };
  } else if (settingKey === "additionalArgs") {
    placeholder = "e.g., --livereload --drafts";
  }

  const newValue = await vscode.window.showInputBox({
    prompt,
    value: currentValue?.toString() || "",
    placeHolder: placeholder,
    validateInput,
  });

  if (newValue !== undefined) {
    let valueToSave: any = newValue;
    if (settingKey === "defaultPort") {
      valueToSave = parseInt(newValue);
    }

    // Save to workspace settings only
    await config.update(
      settingKey,
      valueToSave,
      vscode.ConfigurationTarget.Workspace
    );
    provider.refresh();
    updateStatusBar();
    vscode.window.showInformationMessage(
      `✅ Updated ${settingKey} to: ${newValue}`
    );
  }
}

function updateStatusBar() {
  if (statusBarItem) {
    statusBarItem.dispose();
  }

  const config = vscode.workspace.getConfiguration("jekyllServerButton");
  const showInStatusBar = config.get<boolean>("showInStatusBar", true);

  if (showInStatusBar) {
    statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left
    );

    if (isServerRunning) {
      statusBarItem.text = "$(stop) Jekyll Running";
      statusBarItem.tooltip = "Jekyll server is running - Click to stop";
      statusBarItem.command = "jekyll-server-button.stopServer";
      statusBarItem.backgroundColor = new vscode.ThemeColor(
        "statusBarItem.warningBackground"
      );
    } else {
      statusBarItem.text = "$(server) Jekyll Serve";
      statusBarItem.tooltip = "Click to start Jekyll server";
      statusBarItem.command = "jekyll-server-button.startServer";
    }

    statusBarItem.show();
  }
}

function startJekyllServer() {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage("❌ No workspace folder found");
    return;
  }

  if (isServerRunning) {
    vscode.window.showWarningMessage("⚠️ Jekyll server is already running");
    return;
  }

  const config = vscode.workspace.getConfiguration("jekyllServerButton");
  const port = config.get<number>("defaultPort", 4000);
  const host = config.get<string>("defaultHost", "127.0.0.1");
  const additionalArgs = config.get<string>("additionalArgs", "");

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
    name: `🌐 Jekyll Server (${host}:${port})`,
    cwd: workspaceFolder.uri.fsPath,
    shellPath: process.platform === "win32" ? "powershell.exe" : "bash",
  });

  // Send the Jekyll serve command
  currentTerminal.sendText(command);
  currentTerminal.show();

  // Update status immediately
  isServerRunning = true;
  provider.refresh();
  updateStatusBar();

  vscode.window.showInformationMessage(
    `🚀 Jekyll server starting on ${host}:${port}...`
  );
}

function stopJekyllServer() {
  if (currentTerminal && isServerRunning) {
    currentTerminal.dispose();
    currentTerminal = undefined;
    isServerRunning = false;
    provider.refresh();
    updateStatusBar();
    vscode.window.showInformationMessage("🛑 Jekyll server stopped");
  } else {
    vscode.window.showWarningMessage(
      "⚠️ No Jekyll server is currently running"
    );
  }
}

export function activate(context: vscode.ExtensionContext) {
  try {
    // Create and register the tree data provider
    provider = new JekyllServerProvider();
    const disposable = vscode.window.registerTreeDataProvider(
      "jekyllServerView",
      provider
    );
    context.subscriptions.push(disposable);

    console.log(
      "Jekyll Server Button: Tree data provider registered successfully"
    );

    // Register all commands
    const commands = [
      vscode.commands.registerCommand(
        "jekyll-server-button.startServer",
        startJekyllServer
      ),
      vscode.commands.registerCommand(
        "jekyll-server-button.stopServer",
        stopJekyllServer
      ),
      vscode.commands.registerCommand("jekyll-server-button.editPort", () =>
        editSetting("defaultPort", "Enter port number for Jekyll server")
      ),
      vscode.commands.registerCommand("jekyll-server-button.editHost", () =>
        editSetting("defaultHost", "Enter host address for Jekyll server")
      ),
      vscode.commands.registerCommand("jekyll-server-button.editArgs", () =>
        editSetting(
          "additionalArgs",
          "Enter additional Jekyll arguments (optional)"
        )
      ),
    ];

    // Add all commands to subscriptions
    context.subscriptions.push(...commands);

    // Create status bar item
    updateStatusBar();

    // Listen for configuration changes
    const configListener = vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("jekyllServerButton")) {
        updateStatusBar();
        provider.refresh();
      }
    });
    context.subscriptions.push(configListener);

    // Clean up on terminal close
    const terminalListener = vscode.window.onDidCloseTerminal(
      (closedTerminal) => {
        if (closedTerminal === currentTerminal) {
          isServerRunning = false;
          currentTerminal = undefined;
          provider.refresh();
          updateStatusBar();
        }
      }
    );
    context.subscriptions.push(terminalListener);

    console.log("Jekyll Server Button: Extension activated successfully");
  } catch (error) {
    console.error("Jekyll Server Button: Error during activation:", error);
    vscode.window.showErrorMessage(
      `Jekyll Server Button activation failed: ${error}`
    );
  }
}

export function deactivate() {
  if (currentTerminal) {
    currentTerminal.dispose();
  }
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}
