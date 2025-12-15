import { DataSizeCount } from "../DataSizeCount";
import { FileSizeItem } from "./FileSizeItem";
import { RegexItem } from "./RegexItem";
import { SelectionItem } from "./SelectionItem";

import * as vscode from "vscode";
import { Settings } from "../Settings";
import { RegexCountItem } from "../types";

export class StatusbarUi {
  private fileSizeItem = new FileSizeItem();
  private selectionItem = new SelectionItem();
  private regexItem = new RegexItem();

  updateStatusBarItem = (args?: any) => {
    // Always update all three items
    this.fileSizeItem.update(args);
    this.selectionItem.update(args);
    this.regexItem.update(args);
    // Wire up .command for each item if available
    const items = [this.fileSizeItem, this.selectionItem, this.regexItem];
    for (const item of items) {
      const sb = item.getStatusBarItem?.();
      if (sb) sb.command = "data-size-count.showCombinedDetails";
    }
  };

  showHide = async (_dataSizeCount: DataSizeCount) => {
    // Open settings so user can set formats to empty to hide items
    const vscode = await import("vscode");
    vscode.commands.executeCommand("workbench.action.openSettings", "data-size-count.statusBar");
  };

  async showCombinedDetails() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage("No active editor.");
      return;
    }
    const dataSizeCount = new DataSizeCount();
    const lines: string[] = [];
    // 📄 File Info
    lines.push("📄 File Info");
    lines.push("──────────────────────────────");
    lines.push(`• File: ${editor.document.fileName}`);
    const fileSize = dataSizeCount.getFileSize();
    if (fileSize) lines.push(`• Size: ${fileSize}`);
    lines.push(`• Language: ${editor.document.languageId}`);
    lines.push(`• Encoding: UTF-8`); // VSCode API doesn't expose encoding directly
    lines.push("");

    // ✂️ Selection Info
    if (dataSizeCount.hasSelection) {
      lines.push("✂️ Selection");
      lines.push("──────────────────────────────");
      const selectedSize = dataSizeCount.getSelectedTextSize();
      if (selectedSize) lines.push(`• Selected Size: ${selectedSize}`);
      lines.push(`• Lines: ${dataSizeCount.getLinesCount()}`);
      lines.push(`• Words: ${dataSizeCount.getWordsCount()}`);
      lines.push(`• Chars: ${dataSizeCount.getCharCount()}`);
      lines.push(`• Chars (no spaces): ${dataSizeCount.getCharCountWithoutSpaces()}`);
      lines.push(`• Empty Lines: ${dataSizeCount.getEmptyLineCount()}`);
      lines.push(`• Duplicate Lines: ${dataSizeCount.getDuplicateLineCount()}`);
      lines.push(`• Duplicate Words: ${dataSizeCount.getDuplicateWordCount()}`);
      const details = dataSizeCount.getDataDetails?.();
      if (details && details.dataType !== "Other") {
        lines.push(`• Data Type: ${details.dataType}`);
        lines.push(`• Data Count: ${details.dataCount}`);
        lines.push(`• Unique Data Count: ${details.uniqueDataCount}`);
        lines.push(`• Max Depth: ${details.maxDepth}`);
      }
      lines.push("");
    }

    // 🔎 Regex Matches
    const regexEntries = (Settings.regexCount || []) as RegexCountItem[];
    const regexLines: string[] = [];
    for (const entry of regexEntries) {
      if (!entry?.regex?.trim()) continue;
      if (entry.onlyOnSelection && !dataSizeCount.hasSelection) continue;
      const count = dataSizeCount.getRegexCount(entry.regex);
      if (count === 0 && !entry.alwaysShow) continue;
      regexLines.push(`• ${entry.title || entry.description || entry.regex}: ${count}`);
    }
    if (regexLines.length) {
      lines.push("🔎 Regex Matches");
      lines.push("──────────────────────────────");
      lines.push(...regexLines);
      lines.push("");
    }

    // Footer
    lines.push(`🕘 Generated: ${new Date().toLocaleString()}`);
    lines.push("Copyable — press Ctrl+S to save.");

    const content = lines.join("\n");
    const doc = await vscode.workspace.openTextDocument({ content, language: "text" });
    await vscode.window.showTextDocument(doc, { preview: true });
  }

  dispose() {
    this.fileSizeItem.dispose();
    this.selectionItem.dispose();
    this.regexItem.dispose();
  }

  getItems() {
    return [this.fileSizeItem, this.selectionItem, this.regexItem];
  }
}
