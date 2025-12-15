import * as vscode from "vscode";
import { RegexCountItem } from "./types";

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
    return (Settings.getSettings("position") as "Right" | "Left") || "Left";
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
  static get regexCount() {
    return Settings.getSettings("regexCount") as RegexCountItem[];
  }
  static get selectionMetricsSeparator() {
    return (Settings.getSettings("selectionMetricsSeparator") as string) || "";
  }
  static get regexCountSeparator() {
    return (Settings.getSettings("regexCountSeparator") as string) || "";
  }
}
