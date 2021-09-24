import * as fs from 'fs';
import * as vscode from 'vscode';
import { SHOW_DETAILS } from './enum';
import { Settings } from './Settings';
const durableJsonLint = require('durable-json-lint');

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

  get editorProps() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return {};
    const document = editor.document;
    const selection = editor.selection;
    const selections = editor.selections;

    const firstLine = document.lineAt(0);
    const lastLine = document.lineAt(document.lineCount - 1);
    const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);

    const editorText = document.getText(textRange);
    const selectedText = selections.map((s) => editor.document.getText(s)).join(' ');
    return { editor, document, selection, selections, textRange, editorText, selectedText };
  }

  showInformation = () => {
    const { fileSize, dataCount, linesCount, wordsCount, type } = this.details;
    let infoText = `File Size: ${fileSize}`;
    infoText += wordsCount || linesCount ? `, Line(s): ${linesCount}, Word(s): ${wordsCount}` : '';
    infoText +=
      type === 'Array' ? `, Array Length: ${dataCount}` : type === 'Object' ? `, Object Size: ${dataCount}` : '';
    vscode.window.showInformationMessage(infoText);
  };

  updateStatusBarItem = () => {
    try {
      let detailsFormat = [];
      const details = this.details;

      if (Object.values(details).every((detail) => !detail)) {
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

      if (Settings.visibility.data && ['Array', 'Object'].includes(details.type)) {
        const countsStr = this.interpolate(details, Settings.dataCountFormat);
        detailsFormat.push(countsStr);
      }

      StatusbarUi.statusBarItem.text = detailsFormat.join('');
    } catch (err) {
      console.log(err);
    }
  };

  get details() {
    const { document, selectedText, selections } = this.editorProps;
    const { dataCountWithBrackets, dataCount, type } = this.getDataCount(selectedText);
    const linesCount = this.getLinesCount(selections);
    const wordsCount = this.getWordsCount(selectedText);

    const filePath = document?.uri?.fsPath;
    const fileSize = filePath ? this.convertBytes(fs.statSync(filePath).size) : false;

    return {
      fileSize,
      linesCount,
      wordsCount,
      dataCountWithBrackets,
      dataCount,
      type,
    };
  }

  getDataCount = (selectedText: string = '') => {
    const dataCount = { dataCountWithBrackets: '', dataCount: '', type: '' };

    try {
      const durableText = durableJsonLint(selectedText.replace(/(,|;)$/gi, ''));
      const data = JSON.parse(durableText?.json);

      if (!data) return dataCount;

      if (Array.isArray(data)) {
        dataCount.dataCount = '' + data.length;
        dataCount.type = 'Array';
        dataCount.dataCountWithBrackets = `[${data.length}]`;
      } else if (typeof data === 'object' && !Array.isArray(data)) {
        dataCount.dataCount = '' + Object.entries(data).length;
        dataCount.type = 'Object';
        dataCount.dataCountWithBrackets = `{${Object.entries(data).length}}`;
      }
    } catch (_err) {}

    return dataCount;
  };

  getLinesCount = (selections: vscode.Selection[] = []): number => {
    let lines = 0;
    if (selections.every((s) => s.isEmpty)) return 0; // returns If there is no selection

    const selectedLines: number[] = [];

    lines = selections.reduce((prev, curr) => {
      const startLine = curr.start.line;
      const endLine = curr.end.line;
      let lineIncrement = 0;

      // This is to avoid counting already selected line by a multi cursor selection
      if (!selectedLines.includes(startLine)) {
        lineIncrement = 1;
        selectedLines.push(startLine);
      }
      return prev + (endLine - startLine) + lineIncrement;
    }, 0);
    return lines;
  };

  getWordsCount = (selectedText: string = '') => {
    selectedText = selectedText.replace(/(^\s*)|(\s*$)/gi, ''); // removes leading and trailing spaces including enter spaces
    selectedText = selectedText.replace(/[^a-zA-Z ]/g, ' '); // replace all non characters symbols by a single space. ex: data-size-count -> data size count
    selectedText = selectedText.replace(/[ ]{2,}/gi, ' '); // replace more than 2 or more spaces with a single space.
    selectedText = selectedText.replace(/\n /, '\n'); // replace enter space charecter with next line

    let selectedTextChunk = selectedText.split(' '); // split by single space
    selectedTextChunk = selectedTextChunk.map((s: string) => (s ? s.trim() : s)); // trim each word
    selectedTextChunk = selectedTextChunk.filter(String).filter((s: string) => s && s.length >= 3); // filter text which are only string and has minimum 3 characters

    const wordsCount = selectedTextChunk.length;
    return wordsCount;
  };

  convertBytes = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) {
      return 'n/a';
    }
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    if (i == 0) {
      return bytes + ' ' + sizes[i];
    }
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  };

  interpolate = (object: Object, format: string) => {
    const keys = Object.keys(object);
    const values = Object.values(object);
    return new Function(...keys, `return \`${format}\`;`)(...values);
  };
}
