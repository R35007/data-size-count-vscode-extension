import * as jsonc from "comment-json";
import * as fs from 'fs';
import * as vscode from 'vscode';
import { Settings } from './Settings';
const json5 = require('json5').default
const jsdom = require('jsdom');

export class DataSizeCount {
  editor?: vscode.TextEditor;
  currentFile?: string;
  fileSize?;
  linesCount?;
  wordsCount?;
  dataDetails: DataDetails = {
    openBracket: '',
    closeBracket: '',
    dataCountWithBrackets: '',
    dataCountDescription: '',
    dataCount: 0,
    dataType: 'Other'
  };

  constructor(args?: any) {

    const { editor, filePath, selectedText, selections } = this.getEditorProps(args);

    this.editor = editor;
    this.currentFile = filePath;

    if (filePath && Settings.visibility.fileSize) {
      this.fileSize = this.getFileSize(filePath);
    }

    if (!editor || !filePath || !selectedText?.trim()) return;


    if (Settings.visibility.selection) {
      this.linesCount = this.getLinesCount(selections as vscode.Selection[]);
      this.wordsCount = this.getWordsCount(selectedText);
    }

    if (Settings.visibility.data) {
      const dataDetails = this.getDataDetails(selectedText);
      this.dataDetails = dataDetails;
    }
  }

  // Function to return all selected Texts and other editor details
  getEditorProps(args?: any) {
    const editor = vscode.window.activeTextEditor;
    const document = editor?.document;
    const selections = editor?.selections;
    const filePath = args?.fsPath || document?.uri?.fsPath;
    const selectedText = selections?.map((s) => document?.getText(s)).join(' ');
    return { editor, filePath, selections, selectedText };
  }

  getFileSize = (filePath: string): string => {
    if (!filePath) return '';
    if (fs.existsSync(filePath)) {
      return this.convertBytes(fs.statSync(filePath).size);
    }
    return '';
  };

  getDataDetails = (selectedText: string = ''): DataDetails => {
    const dataDetails: DataDetails = {
      dataCountDescription: '',
      dataCountWithBrackets: '',
      openBracket: '',
      closeBracket: '',
      dataCount: 0,
      dataType: 'Other',
    };

    const node = this.getValidHTML(selectedText);
    const json = this.getValidJSON(selectedText);

    if (node) {
      const elementCount = node.length > 1 ? node.length : node[0].children.length;

      dataDetails.dataType = 'HTML';
      dataDetails.dataCount = elementCount;
      dataDetails.openBracket = '<';
      dataDetails.closeBracket = '>';
      dataDetails.dataCountWithBrackets = `<${elementCount}>`;
      dataDetails.dataCountDescription = node.length > 1 ? 'Element(s)' : 'Child Element(s)';
    } else if (json) {
      if (Array.isArray(json)) {
        const length = json.length;

        dataDetails.dataType = 'Array';
        dataDetails.dataCount = length;
        dataDetails.openBracket = '[';
        dataDetails.closeBracket = ']';
        dataDetails.dataCountWithBrackets = `[${length}]`;
        dataDetails.dataCountDescription = `Array Length`;
      } else if (typeof json === 'object' && !Array.isArray(json)) {
        const size = Object.entries(json).length;

        dataDetails.dataType = 'Object';
        dataDetails.dataCount = size;
        dataDetails.openBracket = '{';
        dataDetails.closeBracket = '}';
        dataDetails.dataCountWithBrackets = `{${size}}`;
        dataDetails.dataCountDescription = `Object Size`;
      }
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
    if (!selectedText?.trim()) return 0;
    selectedText = selectedText.replace(/(^\s*)|(\s*$)/gi, ''); // removes leading and trailing spaces including enter spaces
    selectedText = selectedText.replace(/[^a-zA-Z ]/g, ' '); // replace all non characters symbols by a single space. ex: data-size-count -> data size count
    selectedText = selectedText.replace(/[ ]{2,}/gi, ' '); // replace more than 2 or more spaces with a single space.
    selectedText = selectedText.replace(/\n /, '\n'); // replace enter space character with next line

    let selectedTextChunk = selectedText.split(' '); // split by single space
    selectedTextChunk = selectedTextChunk.map((s: string) => (s ? s.trim() : s)); // trim each word
    selectedTextChunk = selectedTextChunk.filter(String).filter((s: string) => s && s.length >= 2); // filter text which are only string and has minimum 3 characters

    const wordsCount = selectedTextChunk.length;
    return wordsCount;
  };

  // Converts the file size from Bytes to KB | MB | GB | TB
  convertBytes = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
      return '';
    }
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    if (i === 0) {
      return bytes + ' ' + sizes[i];
    }
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  };

  // Makes the selected Text as a more durable JSON using regex and returns JSON data if true.
  getValidJSON(originalData: string = ''): Object | any[] | undefined {
    let dataText = originalData.trim();

    // remove , or ; at the end of the string and set it to the delimiter
    if (dataText.endsWith(";") || dataText.endsWith(",") || dataText.endsWith("\n")) {
      dataText = dataText.substring(0, dataText.length - 1).trim();
    }

    try {
      return JSON.parse(dataText) as object | any[];
    } catch (err) {
      try {
        // If parsing json with comment-json doesn't work the try with json5 parsing
        return jsonc.parse(dataText) as object | any[];
      } catch (error: any) {
        try {
          // If parsing json with comment-json doesn't work the try with json5 parsing
          return json5.parse(dataText) as object | any[];
        } catch (error: any) {
          // console.log(err);
        }
      }
    }
  };

  // TODO: Get Tags even if selected text is a html or body tag
  // For now it returns tags that are selected only under a body tag
  // Checks if a given string is a valid HTML and returns the DOM if true.
  getValidHTML(selectedText: string) {
    try {
      const escapedText = this.tagEscape(selectedText);

      // returns false if the given string is not a valid HTML Tag
      if (!(escapedText.startsWith('<') && escapedText.endsWith('>'))) return;

      const { JSDOM } = jsdom;
      const dom = new JSDOM(`<div id="_virtualDom">${selectedText}</div>`);
      const _virtualDom = dom.window.document.querySelector('#_virtualDom');

      return _virtualDom.children;
    } catch (err) {
      // console.log(err);
    }
  }

  tagEscape(selectedText: string): string {
    const escapedString = selectedText
      .trim()
      .replace(/\n/gi, '') // removes Enter Character
      .replace(/\s/gi, ''); // removes spaces
    return escapedString;
  }
}

interface DataDetails {
  dataCount: number;
  openBracket: string;
  closeBracket: string;
  dataCountWithBrackets: string;
  dataCountDescription: string;
  dataType: 'Array' | 'Object' | 'HTML' | 'Other';
}
