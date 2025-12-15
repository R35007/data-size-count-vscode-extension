import * as vscode from "vscode";
import { StatusbarUi } from "./StatusbarUI";

export function activate(context: vscode.ExtensionContext) {
  const statusbarUi = new StatusbarUi();
  // Register listeners to keep status items up-to-date
  context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(statusbarUi.updateStatusBarItem));
  context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(statusbarUi.updateStatusBarItem));

  // Debounce document changes to avoid heavy regex work
  let docChangeTimer: NodeJS.Timeout | undefined;
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((args) => {
      if (docChangeTimer) clearTimeout(docChangeTimer);
      docChangeTimer = setTimeout(() => statusbarUi.updateStatusBarItem(args), 300);
    })
  );

  // Update initially
  statusbarUi.updateStatusBarItem();

  // Register combined details command
  context.subscriptions.push(
    vscode.commands.registerCommand("data-size-count.showCombinedDetails", () => statusbarUi.showCombinedDetails())
  );

  // Dispose all items on deactivate
  context.subscriptions.push({ dispose: () => statusbarUi.dispose() });
}
