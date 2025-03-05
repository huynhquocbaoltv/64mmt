import * as vscode from "vscode";

export class CodeLensProvider implements vscode.CodeLensProvider {
  provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CodeLens[]> {
    const codeLens: vscode.CodeLens[] = [];
    const functionRegex = /function\s+(\w+)\s*\(/g;
    let match;

    while ((match = functionRegex.exec(document.getText()))) {
      const functionName = match[1];
      const functionStart = match.index;
      const functionStartPos = document.positionAt(functionStart);

      // Tìm vị trí kết thúc của function
      const functionEnd = this.findFunctionEnd(document, functionStart);
      const functionEndPos = document.positionAt(functionEnd);

      // Lấy đoạn code của function
      const code = document.getText(
        new vscode.Range(functionStartPos, functionEndPos)
      );

      const command: vscode.Command = {
        title: "Phân tích code",
        command: "63mmt.analyzeCode",
        arguments: [code], // Truyền code của function vào lệnh
      };

      codeLens.push(
        new vscode.CodeLens(
          new vscode.Range(functionStartPos, functionStartPos),
          command
        )
      );
    }

    return codeLens;
  }

  private findFunctionEnd(
    document: vscode.TextDocument,
    startIndex: number
  ): number {
    const text = document.getText();
    let braceCount = 0;
    let inString = false;
    let stringChar = "";

    for (let i = startIndex; i < text.length; i++) {
      const char = text[i];

      if (inString) {
        if (char === stringChar) {
          inString = false;
        }
      } else {
        if (char === '"' || char === "'" || char === "`") {
          inString = true;
          stringChar = char;
        } else if (char === "{") {
          braceCount++;
        } else if (char === "}") {
          braceCount--;
          if (braceCount === 0) {
            return i + 1;
          }
        }
      }
    }

    return text.length;
  }
}
