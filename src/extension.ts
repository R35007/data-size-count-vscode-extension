import * as vscode from "vscode";

let myStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {
  const myCommandId = "data-size-count.showSelectionCount";
  subscriptions.push(
    vscode.commands.registerCommand(myCommandId, () => {
      const editor = vscode.window.activeTextEditor;
      const { arraySize, objectSize } = getArrayObjectSize(editor);
      const linesCount = getLinesCount(editor);
      const wordsCount = getWordsCount(editor);

      let text = "";
      text += ` lines(s) : ${linesCount}, word(s) : ${wordsCount},`;
      text += arraySize ? ` array length : ${arraySize},` : "";
      text += objectSize ? ` object size : ${objectSize},` : "";
      text = text.endsWith(",") ? text.slice(0, -1) : text;

      vscode.window.showInformationMessage(`Selected : ${text} `);
    })
  );

  // create a new status bar item that we can now manage
  myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
  myStatusBarItem.command = myCommandId;
  subscriptions.push(myStatusBarItem);

  // register some listener that make sure the status bar
  // item always up-to-date
  subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
  subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));

  // update status bar item once at start
  updateStatusBarItem();
}

function updateStatusBarItem(): void {
  const editor = vscode.window.activeTextEditor;
  const { arraySize, objectSize } = getArrayObjectSize(editor);
  const linesCount = getLinesCount(editor);
  const wordsCount = getWordsCount(editor);
  if (linesCount || wordsCount || arraySize || objectSize) {
    let text = "";
    text += ` ${linesCount} : ${wordsCount} :`;
    text += arraySize ? ` ${arraySize} :` : "";
    text += objectSize ? ` ${objectSize} :` : "";

    text = text.endsWith(":") ? text.slice(0, -1) : text;

    myStatusBarItem.text = text;
    myStatusBarItem.show();
  } else {
    myStatusBarItem.hide();
  }
}

const getArrayObjectSize = (editor: vscode.TextEditor | undefined) => {
  let arraySize = 0;
  let objectSize = 0;

  if (editor) {
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    try {
      const textToParse = selectedText.trim().endsWith(",") ? selectedText.slice(0, -1) : selectedText;
      const data = JSON.parse(textToParse);
      if (data && Array.isArray(data)) {
        arraySize = data.length;
      } else if (data && typeof data === "object" && !Array.isArray(data) && data !== null) {
        objectSize = Object.entries(data).length;
      }
    } catch (_err) {}
  }

  return { arraySize, objectSize };
};

const getLinesCount = (editor: vscode.TextEditor | undefined): number => {
  let lines = 0;
  if (editor) {
    lines = editor.selections.reduce((prev, curr) => prev + (curr.end.line - curr.start.line), 0);
  }
  return lines;
};

const getWordsCount = (editor: vscode.TextEditor | undefined) => {
  let size = 0;

  if (editor) {
    const selection = editor.selection;
    let selectedText: any = editor.document.getText(selection);

    selectedText = selectedText.replace(/(^\s*)|(\s*$)/gi, "");
    selectedText = selectedText.replace(/[^a-zA-Z ]/g, " ");
    selectedText = selectedText.replace(/[ ]{2,}/gi, " ");
    selectedText = selectedText.replace(/\n /, "\n");
    selectedText = selectedText.trim();
    selectedText = selectedText.split(" ");
    selectedText = selectedText.map((s: string) => (s ? s.trim() : s));
    size = selectedText.filter(String).length;
  }

  return size;
};
