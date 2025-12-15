import * as vscode from "vscode";
import { DataSizeCount } from "../DataSizeCount";
import { Settings } from "../Settings";
import { createItem, interpolate } from "../utils";

export class SelectionItem {
  private item?: vscode.StatusBarItem;

  update(args?: any) {
    const dataSizeCount = new DataSizeCount(args);
    const selFmt = Settings.selectedSizeFormat;
    const selCountFmt = Settings.selectionCountFormat;
    const dataFmt = Settings.dataCountFormat;

    if (
      !dataSizeCount.currentFile ||
      !dataSizeCount.hasSelection ||
      (!selFmt?.trim().length && !selCountFmt?.trim().length && !dataFmt?.trim().length)
    )
      return this.dispose();

    if (!this.item) {
      this.item = createItem("data-size-count.selection", "Data Size Count: Selection Metrics", Settings.position, Settings.priority - 1);
    }

    const selectionFragments: string[] = [];

    const selectedSize = dataSizeCount.getSelectedTextSize();
    const linesCount = dataSizeCount.getLinesCount();
    const wordsCount = dataSizeCount.getWordsCount();
    const charCount = dataSizeCount.getCharCount();
    const charCountWithoutSpaces = dataSizeCount.getCharCountWithoutSpaces();
    const emptyLineCount = dataSizeCount.getEmptyLineCount();
    const duplicateLinesCount = dataSizeCount.getDuplicateLineCount();
    const duplicateWordsCount = dataSizeCount.getDuplicateWordCount();
    const dataDetails = dataSizeCount.getDataDetails();

    if (selFmt.trim().length && dataSizeCount.hasSelection) selectionFragments.push(interpolate(selFmt, { selectedSize }));

    if (selCountFmt.trim().length && dataSizeCount.hasSelection) {
      selectionFragments.push(
        interpolate(selCountFmt, {
          linesCount,
          wordsCount,
          charCount,
          charCountWithoutSpaces,
          emptyLineCount,
          duplicateLinesCount,
          duplicateWordsCount,
        })
      );
    }

    if (dataFmt.trim().length) {
      if (dataDetails.dataType !== "Other") selectionFragments.push(interpolate(dataFmt, dataDetails));
    }

    const filteredFragments = selectionFragments.filter((x) => x?.trim().length);
    if (!filteredFragments.length) return this.dispose();
    this.item.text = filteredFragments.join(Settings.selectionMetricsSeparator);

    // Tooltip: show actual values, e.g. "10 Lines, 20 Words, 30 Chars. Array Length: 5"
    const tooltipParts = [];
    tooltipParts.push(`Selected Size: ${selectedSize}`);
    tooltipParts.push(`${linesCount} Lines`);
    tooltipParts.push(`${wordsCount} Words`);
    tooltipParts.push(`${charCount} Chars`);
    tooltipParts.push(`${charCountWithoutSpaces} Chars (no spaces)`);
    tooltipParts.push(`${duplicateLinesCount} Duplicate Lines`);
    tooltipParts.push(`${duplicateWordsCount} Duplicate Words`);
    tooltipParts.push(`${emptyLineCount} Empty Lines`);
    dataDetails.dataType !== "Other" && tooltipParts.push(`${dataDetails.dataCountDesc}: ${dataDetails.dataCount}`);
    (dataDetails.dataType === "Array" || dataDetails.dataType === "Object") && tooltipParts.push(`Max depth: ${dataDetails.maxDepth}`);

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
