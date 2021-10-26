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
      let detailsFormat: string[] = [];
      const details = new DataSizeCount(vscode.window.activeTextEditor);

      if (!details.editor) {
        return StatusbarUi.statusBarItem.hide();
      }

      StatusbarUi.statusBarItem.show();

      if (details.fileSize) {
        const fileSizeStr = this.interpolate(details, 'File Size: ${fileSize}');
        detailsFormat.push(fileSizeStr);
      }

      if (details.linesCount) {
        const countsStr = this.interpolate(details, ', Line(s): ${linesCount}, Word(s):${wordsCount}');
        detailsFormat.push(countsStr);
      }

      if (details.dataCount) {
        const countsStr = this.interpolate(details, `, ${details.dataCountDescription}: ${details.dataCount}`);
        detailsFormat.push(countsStr);
      }

      const actionTxt = 'Show / Hide';
      vscode.window.showInformationMessage(detailsFormat.join(''), actionTxt).then((choice) => {
        choice && choice === actionTxt && this.showHide(details);
      });
    } catch (err) {
      console.log(err);
    }
  };

  updateStatusBarItem = () => {
    try {
      let detailsFormat = [];

      const activeTextEditor = vscode?.window?.activeTextEditor;

      if (activeTextEditor) {
        return StatusbarUi.statusBarItem.hide();
      }

      const details = new DataSizeCount(activeTextEditor);
      StatusbarUi.statusBarItem.show();

      if (details.fileSize) {
        const fileSizeStr = this.interpolate(details, Settings.fileSizeFormat);
        detailsFormat.push(fileSizeStr);
      }

      if (details.linesCount) {
        const countsStr = this.interpolate(details, Settings.selectionCountFormat);
        detailsFormat.push(countsStr);
      }

      if (details.dataCount) {
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

  showHide = async (details?: DataSizeCount) => {
    const result = await vscode.window.showQuickPick(
      [
        {
          label: 'File Size',
          picked: Settings.visibility.fileSize,
          description: `Show File Size in StatusBar.`,
          detail: details?.fileSize,
          alwaysShow: true,
        },
        {
          label: 'Lines Count & Words Count',
          picked: Settings.visibility.selection,
          description: `Show Lines Count & Words Count in StatusBar.`,
          detail: details ? `${details.linesCount || 0}:${details.wordsCount || 0}` : '',
          alwaysShow: true,
        },
        {
          label: 'Data Count',
          picked: Settings.visibility.data,
          description: `Show Data Count in StatusBar.`,
          detail: details?.dataCount ? `${details.dataCountDescription}: ${details.dataCount}` : '',
          alwaysShow: true,
        },
      ],
      {
        canPickMany: true,
        placeHolder: 'Please select to Show in Statusbar',
      }
    );

    if (result?.length) {
      const visibility = {
        fileSize: result.some((r) => r.label === 'File Size'),
        selection: result.some((r) => r.label === 'Lines Count & Words Count'),
        data: result.some((r) => r.label === 'Data Count'),
      };
      Settings.visibility = visibility;
    }
  };
}
