import * as fs from 'fs';
import * as vscode from 'vscode';
const durableJsonLint = require('durable-json-lint');
const jsdom = require('jsdom');

export class DataSizeCount {
  editor?: vscode.TextEditor;
  fileSize;
  linesCount;
  wordsCount;
  dataCountWithBrackets;
  dataCountDescription;
  dataCount;
  dataType: 'Array' | 'Object' | 'HTML' | 'Other' = 'Other';

  constructor(editor?: vscode.TextEditor) {
    if (!editor) return;

    this.editor = editor;
    const { selectedText, selections, filePath } = this.getEditorProps(this.editor);

    const { dataType, dataCount, dataCountWithBrackets, dataCountDescription } = this.getDataDetails(selectedText);
    this.dataType = dataType;
    this.dataCount = dataCount;
    this.dataCountWithBrackets = dataCountWithBrackets;
    this.dataCountDescription = dataCountDescription;

    this.linesCount = this.getLinesCount(selections);
    this.wordsCount = this.getWordsCount(selectedText);

    this.fileSize = filePath ? this.convertBytes(fs.statSync(filePath).size) : false;
  }

  // Function to return all selected Texts and other editor details
  getEditorProps(editor: vscode.TextEditor): EditorProps {
    const document = editor.document;
    const selection = editor.selection;
    const selections = editor.selections;

    const filePath = document.uri.fsPath;

    const firstLine = document.lineAt(0);
    const lastLine = document.lineAt(document.lineCount - 1);
    const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);

    const editorText = document.getText(textRange);
    const selectedText = selections.map((s) => editor.document.getText(s)).join(' ');
    return { editor, document, selection, selections, filePath, textRange, editorText, selectedText };
  }

  getDataDetails = (selectedText: string = ''): DataDetails => {
    const dataDetails: DataDetails = {
      dataCountDescription: '',
      dataCountWithBrackets: '',
      dataCount: '',
      dataType: 'Other',
    };

    const json = this.getValidJSON(selectedText);
    const node = this.getValidHTML(selectedText);

    if (json) {
      if (Array.isArray(json)) {
        const length = json.length;

        dataDetails.dataType = 'Array';
        dataDetails.dataCount = '' + length;
        dataDetails.dataCountWithBrackets = `[${length}]`;
        dataDetails.dataCountDescription = `Array Length`;
      } else if (typeof json === 'object' && !Array.isArray(json)) {
        const size = Object.entries(json).length;

        dataDetails.dataType = 'Object';
        dataDetails.dataCount = '' + size;
        dataDetails.dataCountWithBrackets = `{${size}}`;
        dataDetails.dataCountDescription = `Object Size`;
      }
    } else if (node) {
      const childElementCount = node.childElementCount;

      dataDetails.dataType = 'HTML';
      dataDetails.dataCount = '' + childElementCount;
      dataDetails.dataCountWithBrackets = `<${childElementCount}>`;
      dataDetails.dataCountDescription = `Child Element(s)`;
    }

    return dataDetails;
  };

  // Returns number of selected lines
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

  // Returns number of selected words
  getWordsCount = (selectedText: string = ''): number => {
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

  // Converts the file size from Bytes to KB | MB | GB | TB
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

  // Checks if a given string is a valid JSON and returns the JSON data if true.
  getValidJSON(selectedText: string): Object | any[] | undefined {
    try {
      const durableText = durableJsonLint(selectedText.replace(/(,|;)$/gi, ''));
      const data = JSON.parse(durableText?.json);
      return data;
    } catch (err) {}
  }

  // Checks if a given string is a valid HTML and returns the DOM if true.
  getValidHTML(selectedText: string) {
    try {
      const escapedText = this.escape(selectedText);

      // returns false if the given string is not a valid HTML Tag
      if (!(escapedText.startsWith('<') && escapedText.endsWith('>'))) return;

      const { JSDOM } = jsdom;
      const dom = new JSDOM(`<div id="_virtualDom">${selectedText}</div>`);
      const _virtualDom = dom.window.document.querySelector('#_virtualDom');

      // returns false if the given string is not a valid HTML
      if (this.escape(_virtualDom.innerHTML) !== escapedText) return;

      return _virtualDom.children[0];
    } catch (err) {}
  }

  // removes Enter and Spaces for now
  escape(selectedText: string) {
    const str = selectedText
      .trim()
      .replace(/\n/gi, '') // removes Enter Charecter
      .replace(/\s/g, ''); // removes spaces
    return str;
  }
}

interface EditorProps {
  editor: vscode.TextEditor;
  document: vscode.TextDocument;
  selection: vscode.Selection;
  selections: vscode.Selection[];
  filePath: string;
  textRange: vscode.Range;
  editorText: string;
  selectedText: string;
}

interface DataDetails {
  dataCount: string;
  dataCountWithBrackets: string;
  dataCountDescription: string;
  dataType: 'Array' | 'Object' | 'HTML' | 'Other';
}
