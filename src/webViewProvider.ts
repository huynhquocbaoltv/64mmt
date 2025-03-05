import * as vscode from "vscode";
import { Step } from "./services";

export class WebViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "63mmt.webview";

  private webview?: vscode.WebviewView;

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken
  ) {
    this.webview = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
    };

    this.getWebviewContent();
  }

  public getWebviewContent(steps: Step[] = []) {
    if (!this.webview) {
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>63mmt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
          }
          h1 {
            text-align: center;
            color: #007acc;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          }
          ul {
            list-style-type: none;
            padding: 0;
          }
          li {
            background: #e3f2fd;
            margin: 10px 0;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            border: 1px solid #007acc;
          }
          .step-title {
            font-weight: bold;
            font-size: 1.1em;
          }
          .step-content {
            display: none;
            padding: 10px;
            background: #ffffff;
            border-top: 1px solid #007acc;
            margin-top: 5px;
          }
          pre {
            background: #1e1e1e;
            color: #ffffff;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>64mmt</h1>
          ${
            steps.length === 0
              ? `<p style="text-align: center; font-size: 1.2em; color: #ff5252;">Không có đoạn mã nào để hiển thị</p>`
              : `<ul>
                  ${steps
                    .map(
                      (step, index) => `
                        <li onclick="toggleStep(${index})">
                          <div class="step-title">${step.title}</div>
                          <div id="step-content-${index}" class="step-content">
                            <p>${step.content}</p>
                            <pre><code>${step.codeKey}</code></pre>
                          </div>
                        </li>`
                    )
                    .join("")}
                </ul>`
          }
        </div>
        <script>
          function toggleStep(index) {
            const content = document.getElementById('step-content-' + index);
            if (content.style.display === 'none' || content.style.display === '') {
              content.style.display = 'block';
            } else {
              content.style.display = 'none';
            }
          }
        </script>
      </body>
      </html>`;

    this.webview.webview.html = htmlContent;
  }
}
