import * as jsonc from "comment-json";
const json5 = require("json5").default;
const jsdom = require("jsdom");

// Converts bytes to human-readable format
function tagEscape(selectedText: string): string {
  const escapedString = selectedText
    .trim()
    .replace(/\n/gi, "") // removes Enter Character
    .replace(/\s/gi, ""); // removes spaces
  return escapedString;
}

// TODO: Get Tags even if selected text is a html or body tag
// For now it returns tags that are selected only under a body tag
// Checks if a given string is a valid HTML and returns the DOM if true.
export function getValidHTML(selectedText?: string) {
  if (!selectedText?.trim().length) return;

  try {
    const escapedText = tagEscape(selectedText);

    // returns false if the given string is not a valid HTML Tag
    if (!(escapedText.startsWith("<") && escapedText.endsWith(">"))) return;

    const { JSDOM } = jsdom;
    const dom = new JSDOM(`<div id="_virtualDom">${selectedText}</div>`);
    const _virtualDom = dom.window.document.querySelector("#_virtualDom");

    return _virtualDom.children;
  } catch (err) {
    // console.log(err);
    return;
  }
}

// Makes the selected Text as a more durable JSON using regex and returns JSON data if true.
export function getValidJSON(originalData?: string): Object | any[] | undefined {
  if (!originalData?.trim().length) return;

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
}

// Helps to convert template literal strings to applied values.
// Ex : "Line(s):${linesCount}, Word(s):${wordsCount}" -> "Line(s):12, Word(s):10"
export const interpolate = (format: string, object: Object = {}) => {
  try {
    const keys = Object.keys(object);
    const values = Object.values(object);
    return new Function(...keys, `return \`${format}\`;`)(...values);
  } catch (err) {
    console.log(err);
    return "";
  }
};

// Converts the file size from Bytes to KB | MB | GB | TB
export const convertBytes = (bytes: number): string => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) {
    return "";
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i === 0) {
    return bytes + " " + sizes[i];
  }
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
};
