import * as vscode from 'vscode';
import { DataSizeCount } from './DataSizeCount';
import { Commands } from './enum';
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
      StatusbarUi.statusBarItem.command = Commands.SHOW_FILE_DETAILS;
    }
    return StatusbarUi._statusBarItem;
  }

  static set statusBarItem(val: vscode.StatusBarItem) {
    StatusbarUi._statusBarItem = val;
  }

  details!: DataSizeCount;

  showInformation = (args?: any) => {
    if (!this.details.currentFile && args?.fsPath) {
      const details = new DataSizeCount(args);
      this.details = details;
      StatusbarUi.statusBarItem.show();
    }

    if (!this.details.currentFile) {
      vscode.window.showErrorMessage(`Invalid file or file size may be larger than 5mb.\n
      Please right on click the file and select Show File Details to get File Details.`);
      return StatusbarUi.statusBarItem.hide();
    }

    const { detailsStatusBarFormat = [], detailsPopupFormat = [] } = this.getDetailsFormat(this.details);
    StatusbarUi.statusBarItem.text = detailsStatusBarFormat.join('');

    const actionTxt = 'Show / Hide';
    vscode.window.showInformationMessage(detailsPopupFormat.join(''), actionTxt).then((choice) => {
      choice && choice === actionTxt && this.showHide(this.details);
    });
  };

  updateStatusBarItem = (args?: any) => {
    const details = new DataSizeCount(args);
    this.details = details;
    if (!details.currentFile) return StatusbarUi.statusBarItem.hide();
    StatusbarUi.statusBarItem.show();

    const { detailsStatusBarFormat = [] } = this.getDetailsFormat(details);
    StatusbarUi.statusBarItem.text = detailsStatusBarFormat.join('');
  };

  getDetailsFormat = (details: DataSizeCount) => {
    try {
      let detailsStatusBarFormat = [];
      let detailsPopupFormat: string[] = [];

      if (details.fileSize) {
        detailsStatusBarFormat.push(this.interpolate(details, Settings.fileSizeFormat));
        detailsPopupFormat.push(this.interpolate(details, 'File Size: ${fileSize}'));
      }

      if (details.linesCount) {
        detailsStatusBarFormat.push(this.interpolate(details, Settings.selectionCountFormat));
        detailsPopupFormat.push(this.interpolate(details, ', Line(s): ${linesCount}, Word(s):${wordsCount}'));
      }

      if (details.dataDetails.dataCount) {
        detailsStatusBarFormat.push(this.interpolate(details.dataDetails, Settings.dataCountFormat));
        detailsPopupFormat.push(this.interpolate(details.dataDetails, `, ${details.dataDetails.dataCountDescription}: ${details.dataDetails.dataCount}`));
      }

      return { detailsStatusBarFormat, detailsPopupFormat };
    } catch (err) {
      // console.error(err);
      return {};
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
          detail: details?.dataDetails.dataCount ? `${details.dataDetails.dataCountDescription}: ${details.dataDetails.dataCount}` : '',
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
