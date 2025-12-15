import * as vscode from "vscode";
import { DataSizeCount } from "../DataSizeCount";
import { Settings } from "../Settings";
import { RegexCountItem } from "../types";
import { createItem, interpolate } from "../utils";

export class RegexItem {
  private item?: vscode.StatusBarItem;

  update(args?: any) {
    const dataSizeCount = new DataSizeCount(args);
    const regexEntries = (Settings.regexCount || []) as RegexCountItem[];
    const activeRegexEntries = regexEntries.filter((e) => e?.format?.trim().length && e?.regex?.trim().length);
    if (!dataSizeCount.currentFile || !activeRegexEntries.length) {
      this.dispose();
      return;
    }
    activeRegexEntries.sort((a, b) => (a.order || 0) - (b.order || 0));
    const parts: string[] = [];
    const tooltipParts = [];

    for (const entry of activeRegexEntries) {
      if (entry.onlyOnSelection && !dataSizeCount.hasSelection) continue;
      const count = dataSizeCount.getRegexCount(entry.regex);
      if (count === 0 && !entry.alwaysShow) continue;
      const part = interpolate(entry.format, { matchCount: count });
      parts.push(part);
      tooltipParts.push(entry.title ? `${entry.title}: ${count}` : part);
    }
    if (!this.item) {
      this.item = createItem("data-size-count.regex", "Data Size Count: Regex count", Settings.position, Settings.priority - 2);
    }
    const filteredParts = parts.filter((x) => x?.trim().length);
    if (!filteredParts.length) return this.dispose();

    this.item.text = filteredParts.join(Settings.regexCountSeparator);

    this.item.tooltip = tooltipParts.join(",\n");
    this.item.command = "data-size-count.showCombinedDetails";
    this.item.show();
  }

  show() {
    this.item?.show();
  }

  dispose() {
    this.item?.dispose();
    this.item = undefined;
  }

  getStatusBarItem() {
    return this.item;
  }
}
