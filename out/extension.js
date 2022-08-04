"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const path = require("path");
const vscode = require("vscode");
const env = process.env;
const outputDir = (env.Tmp ? path.join(env.Tmp, "vscode-vector-aquarium") : "");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-vector-aquarium" is now active!');
    const setting = new Setting(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('vscode-vector-aquarium.view', setting));
    let disposable = vscode.commands.registerCommand('vscode-vector-aquarium.open', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from vscode-vector-aquarium!');
        const panel = vscode.window.createWebviewPanel("vector-aquarium", "vector-aquarium", vscode.ViewColumn.Beside, {
            enableScripts: true,
            enableFindWidget: true,
            localResourceRoots: [vscode.Uri.file(outputDir)],
        });
        panel.webview.html = "<h1>Hellwefawefaweo !!!!!</h1>";
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
class Setting {
    constructor(extensionUri) {
        this.extensionUri = extensionUri;
    }
    resolveWebviewView(webviewView, context, token) {
        const scriptPathOnDisk = vscode.Uri.joinPath(this.extensionUri, 'dist', 'index.js');
        const scriptUri = webviewView.webview.asWebviewUri(scriptPathOnDisk);
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = this.buildView(scriptUri);
    }
    buildView(scriptUri) {
        // Use a nonce to only allow specific scripts to be run
        const nonce = getNonce();
        return `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	<div id="app"></div>
	<script nonce="${nonce}" src="${scriptUri}"> </script>
</body>
</html>
`;
    }
}
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=extension.js.map