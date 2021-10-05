import * as fs from 'fs';
import * as vscode from 'vscode';
import { Settings } from './Settings';
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

    if (Settings.visibility.fileSize) {
      this.fileSize = this.getFileSize(filePath);
    }

    if (!selectedText?.trim()) return;

    if (Settings.visibility.selection) {
      this.linesCount = this.getLinesCount(selections);
      this.wordsCount = this.getWordsCount(selectedText);
    }

    if (Settings.visibility.data) {
      const { dataType, dataCount, dataCountWithBrackets, dataCountDescription } = this.getDataDetails(selectedText);
      this.dataType = dataType;
      this.dataCount = dataCount;
      this.dataCountWithBrackets = dataCountWithBrackets;
      this.dataCountDescription = dataCountDescription;
    }
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
      dataCount: 0,
      dataType: 'Other',
    };

    const node = this.getValidHTML(selectedText);
    const json = this.getValidJSON(selectedText);

    if (node) {
      const elementCount = node.length > 1 ? node.length : node[0].children.length;

      dataDetails.dataType = 'HTML';
      dataDetails.dataCount = elementCount;
      dataDetails.dataCountWithBrackets = `<${elementCount}>`;
      dataDetails.dataCountDescription = node.length > 1 ? 'Element(s)' : 'Child Element(s)';
    } else if (json) {
      if (Array.isArray(json)) {
        const length = json.length;

        dataDetails.dataType = 'Array';
        dataDetails.dataCount = length;
        dataDetails.dataCountWithBrackets = `[${length}]`;
        dataDetails.dataCountDescription = `Array Length`;
      } else if (typeof json === 'object' && !Array.isArray(json)) {
        const size = Object.entries(json).length;

        dataDetails.dataType = 'Object';
        dataDetails.dataCount = size;
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
    const escapedText = this.jsonEscape(selectedText);
    try {
      const data = JSON.parse(escapedText);
      return data;
    } catch (err) {
      return this.getDurableJSON(escapedText);
    }
  }

  // Makes the selected Text as a more durable JSON using regex and returns JSON data if true.
  getDurableJSON(selectedText: string): Object | any[] | undefined {
    try {
      const escapedText = this.removeSpecialChars(selectedText);
      const durableText = durableJsonLint(escapedText);
      const data = JSON.parse(durableText?.json);
      return data;
    } catch (err) {
      console.log(err);
    }
  }

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
      console.log(err);
    }
  }

  tagEscape(selectedText: string): string {
    const escapedString = selectedText
      .trim()
      .replace(/\n/gi, '') // removes Enter Charecter
      .replace(/\s/gi, ''); // removes spaces
    return escapedString;
  }

  // TODO: Optimize the code
  // removes Special charaters that are not a JSON compatible
  removeSpecialChars(selectedText: string): string {
    const escapedString = selectedText
      .replace(/(\,\])/g, ']') // replaces ,] -> ]
      .replace(/(\,\})/g, '}') // replaces ,} -> }
      .replace(/(\(.*?\))/gi, 'tag') // replace (...) -> tag
      .replace(/(\<.*?\>)/gi, 'tag') // replace <...> -> tag
      .replace(/(\$\{.*?\})/gi, 'text') // replace ${...} to text

      // TODO: Optimize this pattern
      // removes all special charactors except {[:,'"]}
      // removes ~!@#$%^&*()_+-=();/|<>.?
      .replace(/(\~|\!|\@|\#|\$|\%|\^|\&|\*|\_|\+|\-|\=|\(|\)|\;|\/|\|\<|\>|\.|\||\?)/g, '')

      .replace(/\`/g, "'") // replace back tick with single quote
      .trim();
    return this.jsonEscape(escapedString);
  }

  // removes all Enter, Spaces
  jsonEscape(selectedText: string): string {
    const escapedString = selectedText
      .trim()
      .replace(/\n/g, '') // removes next line
      .replace(/\s/g, '') // removes spaces
      .replace(/\r/g, '') // removes carriage return character.
      .replace(/\t/g, '') // removes tabs
      .replace(/(,|;)$/g, ''); // removes , ; at the end of the selected text
    return escapedString;
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
  dataCount: number;
  dataCountWithBrackets: string;
  dataCountDescription: string;
  dataType: 'Array' | 'Object' | 'HTML' | 'Other';
}
