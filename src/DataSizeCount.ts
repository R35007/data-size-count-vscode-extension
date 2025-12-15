import * as fs from "fs";
import * as vscode from "vscode";
import { convertBytes, getValidHTML, getValidJSON } from "./utils";

interface DataDetails {
  dataCount: number;
  uniqueDataCount: number;
  openBracket: string;
  closeBracket: string;
  dataCountWithBrackets: string;
  uniqueDataCountWithBrackets: string;
  dataCountDesc: string;
  maxDepth: number;
  dataType: "Array" | "Object" | "HTML" | "Other";
}

export class DataSizeCount {
  editor?: vscode.TextEditor;
  currentFile?: string;
  fullDocumentText?: string;
  selectedText?: string;
  selections?: readonly vscode.Selection[];
  hasSelection?: boolean;

  constructor(args?: any) {
    this.editor = vscode.window.activeTextEditor;
    const document = this.editor?.document;
    this.selections = this.editor?.selections;
    this.currentFile = args?.fsPath || document?.uri?.fsPath;
    this.fullDocumentText = this.editor?.document.getText();
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

    const getMaxDepth = (node: any): number => {
      if (node === null || typeof node !== "object") return 0;
      let max = 0;
      if (Array.isArray(node)) {
        for (const el of node) {
          const d = getMaxDepth(el);
          if (d > max) max = d;
        }
      } else {
        for (const k in node) {
          if (Object.prototype.hasOwnProperty.call(node, k)) {
            const d = getMaxDepth(node[k]);
            if (d > max) max = d;
          }
        }
      }
      return 1 + max;
    };

    if (json && Array.isArray(json)) {
      const length = json.length;
      const uniqueLength = [...new Set(json)].length;
      return {
        dataType: "Array",
        maxDepth: getMaxDepth(json),
        dataCount: length,
        uniqueDataCount: uniqueLength,
        openBracket: "[",
        closeBracket: "]",
        dataCountWithBrackets: `[${length}]`,
        uniqueDataCountWithBrackets: `[${uniqueLength}]`,
        dataCountDesc: `Array Length`,
      };
    }

    if (json && typeof json === "object" && !Array.isArray(json)) {
      const size = Object.entries(json).length;
      return {
        dataType: "Object",
        maxDepth: getMaxDepth(json),
        uniqueDataCount: size,
        dataCount: size,
        openBracket: "{",
        closeBracket: "}",
        dataCountWithBrackets: `{${size}}`,
        uniqueDataCountWithBrackets: `{${size}}`,
        dataCountDesc: `Object Size`,
      };
    }

    const node = getValidHTML(this.selectedText);

    if (node) {
      const dataCount = node.length > 1 ? node.length : node[0].children.length;
      return {
        dataType: "HTML",
        maxDepth: 0,
        dataCount,
        uniqueDataCount: dataCount,
        openBracket: "<",
        closeBracket: ">",
        dataCountWithBrackets: `<${dataCount}>`,
        uniqueDataCountWithBrackets: `<${dataCount}>`,
        dataCountDesc: node.length > 1 ? "Element(s)" : "Child Element(s)",
      };
    }

    return {
      dataType: "Other",
      maxDepth: 0,
      dataCount: 0,
      uniqueDataCount: 0,
      openBracket: "",
      closeBracket: "",
      dataCountWithBrackets: "",
      uniqueDataCountWithBrackets: "",
      dataCountDesc: "",
    };
  };

  // Count empty lines in the selection (lines that are empty or contain only whitespace)
  getEmptyLineCount = (): number => {
    if (!this.selectedText?.length) return 0;
    const lines = this.selectedText.split(/\r?\n/);
    let count = 0;
    for (const line of lines) {
      if (!line.trim()) count += 1;
    }
    return count;
  };

  // Count duplicate line occurrences in the selection. Returns total duplicate occurrences (sum of freq-1 for each duplicated line)
  getDuplicateLineCount = (): number => {
    if (!this.selectedText?.trim().length) return 0;
    const lines = this.selectedText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    const freq: Record<string, number> = {};
    for (const l of lines) {
      freq[l] = (freq[l] || 0) + 1;
    }
    let duplicates = 0;
    for (const k in freq) {
      if (freq[k] > 1) duplicates += freq[k] - 1;
    }
    return duplicates;
  };

  // Count duplicate word occurrences in the selection. Returns total duplicate word occurrences (sum of freq-1 for each duplicated word)
  getDuplicateWordCount = (): number => {
    if (!this.selectedText?.trim().length) return 0;
    // Normalize words similarly to getWordsCount
    let text = this.selectedText.replace(/(^\s*)|(\s*$)/gi, "");
    text = text.replace(/[^a-zA-Z ]/g, " ");
    text = text.replace(/[ ]{2,}/gi, " ");
    text = text.replace(/\n /, "\n");
    let words = text
      .split(" ")
      .map((s) => s.trim())
      .filter((s) => s && s.length >= 2);
    const freq: Record<string, number> = {};
    for (const w of words) {
      const key = w.toLowerCase();
      freq[key] = (freq[key] || 0) + 1;
    }
    let duplicates = 0;
    for (const k in freq) {
      if (freq[k] > 1) duplicates += freq[k] - 1;
    }
    return duplicates;
  };

  // Count regex matches. `pattern` may be '/pattern/flags' or a raw pattern. If useFullDocument is true, evaluate against full document text, otherwise against selection (or full document if no selection).
  getRegexCount = (pattern: string): number => {
    if (!pattern || !pattern.length) return 0;
    const text = this.selectedText || this.fullDocumentText || "";

    if (!text.length) return 0;

    // parse pattern
    let regex: RegExp | null = null;
    try {
      // if pattern is of form /.../flags
      const match = pattern.match(new RegExp("^/(.*?)/([gimusy]*)$"));
      if (match) {
        const body = match[1];
        let flags = match[2] || "";
        if (!flags.includes("g")) flags += "gm"; // ensure global
        regex = new RegExp(body, flags);
      } else {
        // raw pattern: create with global flag
        regex = new RegExp(pattern, "gm");
      }
    } catch (e) {
      return 0;
    }

    if (!regex) return 0;
    try {
      const matches = text.match(regex);
      return matches ? matches.length : 0;
    } catch (e) {
      return 0;
    }
  };
}
