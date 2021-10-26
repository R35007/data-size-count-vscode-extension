import * as vscode from 'vscode';
import { SHOW_DETAILS, SHOW_HIDE_STATUSBAR } from './enum';
import { StatusbarUi } from './StatusBarUI';

export function activate(context: vscode.ExtensionContext) {
  const statusbarUi = new StatusbarUi();

  // Show Details
  context.subscriptions.push(vscode.commands.registerCommand(SHOW_DETAILS, statusbarUi.showInformation));

  // Show Hide Details
  context.subscriptions.push(vscode.commands.registerCommand(SHOW_HIDE_STATUSBAR, statusbarUi.showHide));

  // Show status bar Item
  context.subscriptions.push(StatusbarUi.statusBarItem);

  // register some listener that make sure the status bar item is always up-to-date
  context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(statusbarUi.updateStatusBarItem));
  context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(statusbarUi.updateStatusBarItem));

  // Show Initial Details
  statusbarUi.updateStatusBarItem();
}
