import * as fs from 'fs';
import * as vscode from 'vscode';
import { SHOW_DETAILS } from './enum';
const durableJsonLint = require('durable-json-lint');

export class StatusbarUi {
  static _statusBarItem: vscode.StatusBarItem;

  static get statusBarItem() {
    if (!StatusbarUi._statusBarItem) {
      StatusbarUi._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
      StatusbarUi.statusBarItem.tooltip = 'FileSize Word:Line DataCount';
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
    const selectedText = document.getText(selection);
    return { editor, document, selection, selections, textRange, editorText, selectedText };
  }

  showInformation = () => {
    const { fileSize, arrayLength, objectSize, linesCount, wordsCount, type } = this.details;
    let infoText = `File Size: ${fileSize}`;
    infoText += wordsCount || linesCount ? `, Word(s): ${wordsCount}, Line(s): ${linesCount}` : '';
    infoText +=
      type === 'Array' ? `, Array Length: ${arrayLength}` : type === 'Object' ? `, Object Size: ${objectSize}` : '';
    vscode.window.showInformationMessage(infoText);
  };

  updateStatusBarItem = () => {
    try {
      const { fileSize, arrayLength, objectSize, linesCount, wordsCount, type } = this.details;

      if (!fileSize) {
        StatusbarUi.statusBarItem.hide();
        return;
      }
      StatusbarUi.statusBarItem.show();

      let detailsFormat = `$(file) ${fileSize}`;
      detailsFormat += wordsCount || linesCount ? `  $(list-selection) ${wordsCount}:${linesCount}` : '';
      detailsFormat += type === 'Array' ? `  [${arrayLength}]` : type === 'Object' ? `  {${objectSize}}` : '';

      StatusbarUi.statusBarItem.text = detailsFormat;
    } catch (err) {
      console.log(err);
    }
  };

  get details() {
    const { document, selectedText, selections } = this.editorProps;
    const { arrayLength, objectSize, type } = this.getDataCount(selectedText);
    const linesCount = this.getLinesCount(selections);
    const wordsCount = this.getWordsCount(selectedText);

    const filePath = document?.uri?.fsPath;
    const fileSize = filePath ? this.convertBytes(fs.statSync(filePath).size) : false;

    return {
      fileSize,
      arrayLength,
      objectSize,
      linesCount,
      wordsCount,
      type,
    };
  }

  getDataCount = (selectedText: string = '') => {
    const dataCount = { arrayLength: 0, objectSize: 0, type: '' };

    try {
      const durableText = durableJsonLint(selectedText.replace(/(,|;)$/gi, ''));
      const data = JSON.parse(durableText?.json);

      if (!data) return dataCount;

      if (Array.isArray(data)) {
        dataCount.arrayLength = data.length;
        dataCount.type = 'Array';
      } else if (typeof data === 'object' && !Array.isArray(data)) {
        dataCount.objectSize = Object.entries(data).length;
        dataCount.type = 'Object';
      }
    } catch (_err) {}

    return dataCount;
  };

  getLinesCount = (selections: vscode.Selection[] = []): number => {
    let lines = 0;
    if (selections.every((s) => s.isEmpty)) return 0;

    lines = selections.reduce((prev, curr) => prev + (curr.end.line - curr.start.line), 0) + 1;
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
}
