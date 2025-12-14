import * as fs from "fs";
import * as vscode from "vscode";
import { convertBytes, getValidHTML, getValidJSON } from "./utils";

interface DataDetails {
  dataCount: number;
  openBracket: string;
  closeBracket: string;
  dataCountWithBrackets: string;
  dataCountDesc: string;
  dataType: "Array" | "Object" | "HTML" | "Other";
}

export class DataSizeCount {
  editor?: vscode.TextEditor;
  currentFile?: string;
  selectedText?: string;
  selections?: readonly vscode.Selection[];
  hasSelection?: boolean;

  constructor(args?: any) {
    this.editor = vscode.window.activeTextEditor;
    const document = this.editor?.document;
    this.selections = this.editor?.selections;
    this.currentFile = args?.fsPath || document?.uri?.fsPath;
    this.selectedText = this.selections?.map((s) => document?.getText(s)).join(" ");
    this.hasSelection = this.selections?.some((s) => !s.isEmpty) || false;
  }

  getFileSize = (): string | undefined => {
    if (!this.currentFile || !fs.existsSync(this.currentFile)) return;
    return convertBytes(fs.statSync(this.currentFile).size);
  };

  // Calculate byte length of the selected text using UTF-8 encoding
  getSelectedTextSize = (): string | undefined => {
    if (!this.selectedText?.length) return;
    const bytes = Buffer.byteLength(this.selectedText, "utf8");
    return convertBytes(bytes);
  };

  // Returns number of selected lines
  getLinesCount = (): number => {
    if (!this.selections?.length || this.selections.every((s) => s.isEmpty)) return 0; // returns If there is no selection
    const selectedLines: number[] = [];

    return this.selections.reduce((prev, curr) => {
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
  };

  // Returns number of selected words
  getWordsCount = (): number => {
    if (!this.selectedText?.trim().length) return 0;

    let selectedText = this.selectedText;

    selectedText = selectedText.replace(/(^\s*)|(\s*$)/gi, ""); // removes leading and trailing spaces including enter spaces
    selectedText = selectedText.replace(/[^a-zA-Z ]/g, " "); // replace all non characters symbols by a single space. ex: data-size-count -> data size count
    selectedText = selectedText.replace(/[ ]{2,}/gi, " "); // replace more than 2 or more spaces with a single space.
    selectedText = selectedText.replace(/\n /, "\n"); // replace enter space character with next line

    let selectedTextChunk = selectedText.split(" "); // split by single space
    selectedTextChunk = selectedTextChunk.map((s: string) => (s ? s.trim() : s)); // trim each word
    selectedTextChunk = selectedTextChunk.filter(String).filter((s: string) => s && s.length >= 2); // filter text which are only string and has minimum 3 characters

    const wordsCount = selectedTextChunk.length;
    return wordsCount;
  };

  // Get Selected Characters Count without spaces
  getCharCount = (): number => {
    if (!this.selectedText) return 0;
    return this.selectedText.length;
  };

  // Get Selected Characters Count without spaces
  getCharCountWithoutSpaces = (): number => {
    if (!this.selectedText?.trim().length) return 0;
    const selectedText = this.selectedText.replace(/\s/gi, ""); // removes all spaces including enter spaces
    return selectedText.length;
  };

  getDataDetails = (): DataDetails => {
    const json = getValidJSON(this.selectedText);

    if (json && Array.isArray(json)) {
      const length = json.length;
      return {
        dataType: "Array",
        dataCount: length,
        openBracket: "[",
        closeBracket: "]",
        dataCountWithBrackets: `[${length}]`,
        dataCountDesc: `Array Length`,
      };
    }

    if (json && typeof json === "object" && !Array.isArray(json)) {
      const size = Object.entries(json).length;
      return {
        dataType: "Object",
        dataCount: size,
        openBracket: "{",
        closeBracket: "}",
        dataCountWithBrackets: `{${size}}`,
        dataCountDesc: `Object Size`,
      };
    }

    const node = getValidHTML(this.selectedText);

    if (node) {
      const dataCount = node.length > 1 ? node.length : node[0].children.length;
      return {
        dataType: "HTML",
        dataCount,
        openBracket: "<",
        closeBracket: ">",
        dataCountWithBrackets: `<${dataCount}>`,
        dataCountDesc: node.length > 1 ? "Element(s)" : "Child Element(s)",
      };
    }

    return {
      dataType: "Other",
      dataCount: 0,
      openBracket: "",
      closeBracket: "",
      dataCountWithBrackets: "",
      dataCountDesc: "",
    };
  };
}
