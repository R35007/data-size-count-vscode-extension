import * as vscode from 'vscode';

export class Settings {
  static get configuration() {
    return vscode.workspace.getConfiguration('data-size-count.statusBar');
  }
  static getSettings(val: string) {
    return Settings.configuration.get(val);
  }
  static setSettings(key: string, val: any, isGlobal = true) {
    return Settings.configuration.update(key, val, isGlobal);
  }
  static get position() {
    return (Settings.getSettings('position') as 'Right' | 'Left') || 'Left';
  }
  static get priority() {
    return (Settings.getSettings('priority') as number) || -1;
  }
  static get fileSizeformat() {
    return (Settings.getSettings('fileSizeformat') as string) || '$(file) ${fileSize}';
  }
  static get countsformat() {
    return (
      (Settings.getSettings('countsformat') as string) || '${linesCount} : ${wordsCount} : ${dataSizeWithBrackets}'
    );
  }
  static get visibility() {
    return (Settings.getSettings('visibility') as { fileSize: boolean; selection: boolean }) || {};
  }
  static get itemSeperator() {
    return (Settings.getSettings('itemSeperator') as string) || '  ';
  }
}
