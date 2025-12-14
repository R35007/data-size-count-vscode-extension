import * as vscode from "vscode";
import { StatusbarUi } from "./StatusBarUI";

export function activate(context: vscode.ExtensionContext) {
  const statusbarUi = new StatusbarUi(); // create Status Bar UI Instance
  context.subscriptions.push(StatusbarUi.statusBarItem); // Show status bar Item
  context.subscriptions.push(vscode.commands.registerCommand(StatusbarUi.clickCommand, statusbarUi.showInformation)); // show the details on clicking the status bar item
  // register some listener that make sure the status bar item is always up-to-date
  context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(statusbarUi.updateStatusBarItem));
  context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(statusbarUi.updateStatusBarItem));

  // Show Initial Details
  statusbarUi.updateStatusBarItem();
}
