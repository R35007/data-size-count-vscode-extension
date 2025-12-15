import * as vscode from "vscode";
import { DataSizeCount } from "../DataSizeCount";
import { Settings } from "../Settings";
import { createItem, interpolate } from "../utils";

export class FileSizeItem {
  private item?: vscode.StatusBarItem;

  update(args?: any) {
    const dataSizeCount = new DataSizeCount(args);
    const fileFmt = Settings.fileSizeFormat || "";
    if (!dataSizeCount.currentFile || !fileFmt.trim().length) {
      this.dispose();
      return;
    }
    if (!this.item) {
      this.item = createItem("data-size-count.fileSize", "Data Size Count: File Size", Settings.position, Settings.priority);
    }
    const fileSize = dataSizeCount.getFileSize();
    if (!fileSize) return this.dispose();
    this.item.text = interpolate(fileFmt, { fileSize });
    this.item.tooltip = `File Size: ${fileSize}`;
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
