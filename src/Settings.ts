import * as vscode from "vscode";

export class Settings {
  static get configuration() {
    return vscode.workspace.getConfiguration("data-size-count.statusBar");
  }
  static getSettings(val: string) {
    return Settings.configuration.get(val);
  }
  static setSettings(key: string, val: any, isGlobal = true) {
    return Settings.configuration.update(key, val, isGlobal);
  }
  static get position() {
    return Settings.getSettings("position") as "Right" | "Left";
  }
  static get priority() {
    return (Settings.getSettings("priority") as number) || -1;
  }
  static get fileSizeFormat() {
    return Settings.getSettings("fileSizeFormat") as string;
  }
  static get selectedSizeFormat() {
    return Settings.getSettings("selectedSizeFormat") as string;
  }
  static get selectionCountFormat() {
    return Settings.getSettings("selectionCountFormat") as string;
  }
  static get dataCountFormat() {
    return Settings.getSettings("dataCountFormat") as string;
  }
  static get visibility() {
    return Settings.getSettings("visibility") as { fileSize: boolean; selectedSize: boolean; selection: boolean; data: boolean };
  }
  static set visibility(object: { fileSize: boolean; selectedSize: boolean; selection: boolean; data: boolean }) {
    Settings.setSettings("visibility", object);
  }
}
