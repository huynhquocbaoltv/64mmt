// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { CodeLensProvider } from "./codeLensProvider";
import { analyzeCode } from "./services";
import { WebViewProvider } from "./webViewProvider";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const webViewProvider = new WebViewProvider();
  const codeLensDisposable = vscode.languages.registerCodeLensProvider(
    {
      scheme: "file",
    },
    new CodeLensProvider()
  );

  context.subscriptions.push(codeLensDisposable);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("64mmt-ex-view", webViewProvider)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("63mmt.analyzeCode", (code) => {
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Đang phân tích code...",
          cancellable: true,
        },
        async (progress, token) => {
          try {
            analyzeCode(code).then((steps) => {
              webViewProvider.getWebviewContent(steps);
            });
          } catch (error) {
            vscode.window.showErrorMessage(
              "Có lỗi xảy ra khi phân tích code. Vui lòng thử lại."
            );
          }
        }
      );
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
