import * as vscode from 'vscode';
import { DataSizeCount } from './DataSizeCount';
import { SHOW_DETAILS } from './enum';
import { Settings } from './Settings';

export class StatusbarUi {
  static _statusBarItem: vscode.StatusBarItem;

  static get statusBarItem() {
    if (!StatusbarUi._statusBarItem) {
      StatusbarUi._statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment[Settings.position],
        Settings.priority
      );
      StatusbarUi.statusBarItem.tooltip = 'Show Details';
      StatusbarUi.statusBarItem.command = SHOW_DETAILS;
    }
    return StatusbarUi._statusBarItem;
  }

  static set statusBarItem(val: vscode.StatusBarItem) {
    StatusbarUi._statusBarItem = val;
  }

  showInformation = () => {
    try {
      let detailsFormat = [];
      const details = new DataSizeCount(vscode.window.activeTextEditor);

      if (!details.editor) {
        return StatusbarUi.statusBarItem.hide();
      }

      StatusbarUi.statusBarItem.show();

      if (Settings.visibility.fileSize && details.fileSize) {
        const fileSizeStr = this.interpolate(details, 'File Size: ${fileSize}');
        detailsFormat.push(fileSizeStr);
      }

      if (Settings.visibility.selection && details.linesCount) {
        const countsStr = this.interpolate(details, ', Line(s): ${linesCount}, Word(s):${wordsCount}');
        detailsFormat.push(countsStr);
      }

      if (Settings.visibility.data && ['Array', 'Object', 'HTML'].includes(details.dataType)) {
        const countsStr = this.interpolate(details, `, ${details.dataCountDescription}: ${details.dataCount}`);
        detailsFormat.push(countsStr);
      }

      vscode.window.showInformationMessage(detailsFormat.join(''));
    } catch (err) {
      console.log(err);
    }
  };

  updateStatusBarItem = () => {
    try {
      let detailsFormat = [];
      const details = new DataSizeCount(vscode.window.activeTextEditor);

      if (!details.editor) {
        return StatusbarUi.statusBarItem.hide();
      }

      StatusbarUi.statusBarItem.show();

      if (Settings.visibility.fileSize && details.fileSize) {
        const fileSizeStr = this.interpolate(details, Settings.fileSizeFormat);
        detailsFormat.push(fileSizeStr);
      }

      if (Settings.visibility.selection && details.linesCount) {
        const countsStr = this.interpolate(details, Settings.selectionCountFormat);
        detailsFormat.push(countsStr);
      }

      if (Settings.visibility.data && ['Array', 'Object', 'HTML'].includes(details.dataType)) {
        const countsStr = this.interpolate(details, Settings.dataCountFormat);
        detailsFormat.push(countsStr);
      }

      StatusbarUi.statusBarItem.text = detailsFormat.join('');
    } catch (err) {
      console.log(err);
    }
  };

  // Helps to convert template literal strings to applied values.
  // Ex : "Line(s):${linesCount}, Word(s):${wordsCount}" -> "Line(s):12, Word(s):10"
  interpolate = (object: Object, format: string) => {
    const keys = Object.keys(object);
    const values = Object.values(object);
    return new Function(...keys, `return \`${format}\`;`)(...values);
  };
}
