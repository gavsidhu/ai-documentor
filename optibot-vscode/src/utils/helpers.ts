import axios from 'axios';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export const getKey = async (email: string) => {
  try {
    const res = await axios.post(`https://www.optibot.io/api/optibot/get-key`, {
      email: email,
    });
    return res.data.key;
  } catch (error) {
    return null;
  }
};


export async function processFile() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage('No active text editor found');
    return;
  }

  const document = editor.document;
  const fileContents = document.getText();
  const fileName = path.basename(document.fileName);

  try {
    const response = await axios.post('https://httpbin.org/anything', {
      fileName,
      fileContents,
    });

    console.log(response.data);

    const newContent = response.data.newContent || 'Default content';
    const folderPath = path.join(path.dirname(document.fileName), 'docs');

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    const newFilePath = path.join(folderPath, fileName);
    fs.writeFileSync(newFilePath, newContent);

    const newFileUri = vscode.Uri.file(newFilePath);
    const newDocument = await vscode.workspace.openTextDocument(newFileUri);
    vscode.window.showTextDocument(newDocument);
  } catch (error) {
    vscode.window.showErrorMessage('Error processing the file');
    console.error(error);
  }
}
