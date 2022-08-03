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
    const setting = new Setting();
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('vscode-vector-aquarium.view', setting));
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('vscode-vector-aquarium.open', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from vscode-vector-aquarium!');
        const panel = vscode.window.createWebviewPanel("vector-aquarium", "vector-aquarium", vscode.ViewColumn.Beside, {
            enableScripts: true,
            enableFindWidget: true,
            localResourceRoots: [vscode.Uri.file(outputDir)],
        });
        panel.webview.html = "<h1>Hello !!!!!</h1>";
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
class Setting {
    resolveWebviewView(webviewView, context, token) {
        console.log("OK!");
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
		    <meta charset="UTF-8">
		    <meta http-equiv="X-UA-Compatible" content="IE=edge">
		    <meta name="viewport" content="width=device-width, initial-scale=1.0">
		    <title>Document</title>
		</head>
		<body>
		    <h1>Hello !!!!</h1>
		</body>
		</html>
				`;
    }
}
//# sourceMappingURL=extension.js.map