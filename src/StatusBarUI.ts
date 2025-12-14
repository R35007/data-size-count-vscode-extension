import * as vscode from "vscode";
import { DataSizeCount } from "./DataSizeCount";
import { Settings } from "./Settings";
import { Commands } from "./enum";
import { interpolate } from "./utils";

export class StatusbarUi {
  static _statusBarItem: vscode.StatusBarItem;
  static clickCommand: string;
  static showHideCommand: string;

  static get statusBarItem() {
    if (!StatusbarUi._statusBarItem) {
      StatusbarUi._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment[Settings.position], Settings.priority);
      StatusbarUi.statusBarItem.tooltip = "Show Details";
      StatusbarUi.statusBarItem.command = Commands.SHOW_FILE_DETAILS;
      StatusbarUi.clickCommand = Commands.SHOW_FILE_DETAILS;
      StatusbarUi.showHideCommand = Commands.SHOW_FILE_DETAILS;
    }
    return StatusbarUi._statusBarItem;
  }

  static set statusBarItem(val: vscode.StatusBarItem) {
    StatusbarUi._statusBarItem = val;
  }

  updateStatusBarItem = (args?: any) => {
    const dataSizeCount = new DataSizeCount(args);
    if (!dataSizeCount.currentFile) return StatusbarUi.statusBarItem.hide();

    const metrics = [];

    if (Settings.visibility.fileSize) metrics.push(interpolate(Settings.fileSizeFormat, { fileSize: dataSizeCount.getFileSize() }));
    if (Settings.visibility.selectedSize && dataSizeCount.hasSelection)
      metrics.push(interpolate(Settings.selectedSizeFormat, { selectedSize: dataSizeCount.getSelectedTextSize() }));
    if (Settings.visibility.selection && dataSizeCount.hasSelection) {
      const linesCount = dataSizeCount.getLinesCount();
      const wordsCount = dataSizeCount.getWordsCount();
      const charCount = dataSizeCount.getCharCount();
      const charCountWithoutSpaces = dataSizeCount.getCharCountWithoutSpaces();
      metrics.push(interpolate(Settings.selectionCountFormat, { linesCount, wordsCount, charCount, charCountWithoutSpaces }));
    }
    if (Settings.visibility.data) {
      const dataDetails = dataSizeCount.getDataDetails();
      if (dataDetails.dataType !== "Other") metrics.push(interpolate(Settings.dataCountFormat, dataDetails));
    }

    const filteredMetrics = metrics.filter((x) => x?.trim().length);
    if (!filteredMetrics.length) return StatusbarUi.statusBarItem.hide();

    StatusbarUi.statusBarItem.text = filteredMetrics.join("");
    StatusbarUi.statusBarItem.show();
  };

  showInformation = (args?: any) => {
    this.updateStatusBarItem(args);

    const dataSizeCount = new DataSizeCount(args);
    if (!dataSizeCount.currentFile) return vscode.window.showErrorMessage(`Invalid file or file size may be larger than 5mb.`);

    const metrics = [];

    if (Settings.visibility.fileSize) metrics.push(`File Size: ${dataSizeCount.getFileSize()}`);
    if (Settings.visibility.selectedSize) metrics.push(`Selected Size: ${dataSizeCount.getSelectedTextSize()}`);
    if (Settings.visibility.selection) {
      const linesCount = dataSizeCount.getLinesCount();
      const wordsCount = dataSizeCount.getWordsCount();
      const charCount = dataSizeCount.getCharCount();
      const charCountWithoutSpaces = dataSizeCount.getCharCountWithoutSpaces();
      metrics.push(
        `Line(s) Count: ${linesCount}\nWord(s) Count: ${wordsCount}\nCharacter(s) Count: ${charCount}\nCharacter(s) Count (Without Spaces): ${charCountWithoutSpaces}`
      );
    }
    if (Settings.visibility.data) {
      const dataDetails = dataSizeCount.getDataDetails();
      dataDetails.dataType !== "Other" && metrics.push(`${dataDetails.dataCountDesc}: ${dataDetails.dataCount}`);
    }

    const filteredMetrics = metrics.filter((x) => x?.trim().length);
    if (!filteredMetrics.length) return StatusbarUi.statusBarItem.hide();

    const actionTxt = "Show / Hide";
    vscode.window.showInformationMessage(filteredMetrics.join(", "), actionTxt).then((choice) => {
      choice && choice === actionTxt && this.showHide(dataSizeCount);
    });
  };

  showHide = async (dataSizeCount: DataSizeCount) => {
    try {
      const result = await vscode.window.showQuickPick(
        [
          {
            label: "File Size",
            picked: Settings.visibility.fileSize,
            description: `Show File Size in StatusBar.`,
            detail: dataSizeCount.getFileSize(),
            alwaysShow: true,
          },
          {
            label: "Selected Size",
            picked: Settings.visibility.selectedSize,
            description: `Show Selected Size in StatusBar.`,
            detail: dataSizeCount.hasSelection ? `${dataSizeCount.getSelectedTextSize()}` : "No Selection",
            alwaysShow: true,
          },
          {
            label: "Lines Count, Words Count and Character Count",
            picked: Settings.visibility.selection,
            description: `Show Lines Count & Words Count & Character Count in StatusBar.`,
            detail: `${dataSizeCount.getLinesCount()} : ${dataSizeCount.getWordsCount()} : ${dataSizeCount.getCharCount()} : ${dataSizeCount.getCharCountWithoutSpaces()}`,
            alwaysShow: true,
          },
          {
            label: "Data Count",
            picked: Settings.visibility.data,
            description: `Show Data Count in StatusBar.`,
            detail: dataSizeCount.hasSelection
              ? `${dataSizeCount.getDataDetails().dataCountDesc} : ${dataSizeCount.getDataDetails().dataCount}`
              : "No Selection",
            alwaysShow: true,
          },
        ],
        {
          canPickMany: true,
          placeHolder: "Please select to Show in Statusbar",
        }
      );

      if (!result?.length) return;
      const visibility = {
        fileSize: result.some((r) => r.label === "File Size"),
        selectedSize: result.some((r) => r.label === "Selected Size"),
        selection: result.some((r) => r.label === "Lines Count, Words Count and Character Count"),
        data: result.some((r) => r.label === "Data Count"),
      };
      Settings.visibility = visibility;
    } catch (err) {
      console.log(err);
    }
  };
}
