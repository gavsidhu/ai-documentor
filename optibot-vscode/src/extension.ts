// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios, { AxiosError } from 'axios';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import AuthService, { getCookie } from './AuthService';
import { Octokit } from '@octokit/rest';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "ai-documentor" is now active!');
  const authService = new AuthService(context);

  let disposableLoogin = vscode.commands.registerCommand(
    'ai-documentor.login',
    async () => {}
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'ai-documentor.document',
    async () => {
      const session = await vscode.authentication.getSession(
        'github',
        ['user:email'],
        {
          createIfNone: true,
        }
      );

      const octokit = new Octokit({
        auth: session.accessToken,
      });

      const user = await octokit.users.getAuthenticated();
      console.log(user.data);
      if (!session) {
        vscode.window.showInformationMessage(
          'You need to sign in to use AI Documentor'
        );
        return;
      }

      if (session) {
        // Get the current text editor
        const editor = vscode.window.activeTextEditor;

        // If no text is selected, show an error message
        if (!editor || editor.selection.isEmpty) {
          vscode.window.showErrorMessage('No text selected');
          return;
        }

        // Get the selected text in the editor
        const selection = editor?.selection;
        const selectedText = editor?.document.getText(selection);

        try {
          const response = await axios.post('http://localhost:8080/', {
            selectedText,
          });

          const edit = new vscode.WorkspaceEdit();
          edit.replace(
            editor?.document.uri as vscode.Uri,
            editor?.selection as vscode.Range,
            response.data.content
          );
          await vscode.workspace.applyEdit(edit);
          vscode.window.showInformationMessage('API request successful');
          console.log(response.data.content);
        } catch (error) {
          if (error instanceof AxiosError) {
            console.log(error.message);
          }
          console.log(error);
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
