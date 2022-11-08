// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from 'path';
import * as vscode from 'vscode';
import { defaultSettings } from './defaultSettingsJson';


const env = process.env;
const outputDir = (env.Tmp ? path.join(env.Tmp, "vscode-vector-aquarium") : "");

const isExists = async (uri: vscode.Uri) => {
    try {
        await vscode.workspace.fs.stat(uri);
        return true;
    }
    catch {
        return false;
    }
}

const getSettingFileUri = async (uri: vscode.Uri) => {
    const fileUri = vscode.Uri.joinPath(uri, 'vector-aquarium.json');
    // Create if the setting file doesn't exists.
    try {
        if (!await isExists(fileUri)) {
            throw new Error("setting is not exists");
        }
    }
    catch {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(defaultSettings);
        await vscode.workspace.fs.writeFile(fileUri, encoded);
    }

    // Or write if the setting file is invalid.
    const text = await vscode.workspace.fs.readFile(fileUri);
    const decoder = new TextDecoder();
    const decoded = decoder.decode(text);
    try {
        if (!decoded.split(" ").join("")) {
            throw new Error("setting is not exists");
        }
    }
    catch {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(defaultSettings);
        await vscode.workspace.fs.writeFile(fileUri, encoded);
    }

    return fileUri;
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-vector-aquarium" is now active!');

    // context.subscriptions.push(vscode.commands.registerCommand('vscode-vector-aquarium.open', async () => {
    //     //vscode.window.showTextDocument();
    // }));

    const settingUrl = await getSettingFileUri(context.globalStorageUri);

    context.subscriptions.push(vscode.commands.registerCommand('vscode-vector-aquarium.config', async () => {
        //vscode.window.showTextDocument();
        if (context.globalStorageUri) {
            const doc = await vscode.workspace.openTextDocument(settingUrl);
            await vscode.window.showTextDocument(doc);
        }
    }));

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'vscode-vector-aquarium.view',
            new Setting(context.extensionUri, context.globalStorageUri)
        )
    );

    const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(context.globalStorageUri.path, "**/*.json"));
    watcher.onDidChange(e => {
        vscode.commands.executeCommand('workbench.action.reloadWindow');
    });
}

// this method is called when your extension is deactivated
export function deactivate() { }

class Setting implements vscode.WebviewViewProvider {
    constructor(readonly extensionUri: vscode.Uri, readonly storageUri: vscode.Uri) {

    }

    async resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext<unknown>,
        token: vscode.CancellationToken
    ) {
        const scriptPathOnDisk = vscode.Uri.joinPath(this.extensionUri, 'dist', 'index.js');
        const scriptUri = webviewView.webview.asWebviewUri(scriptPathOnDisk);

        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = await this.buildView(scriptUri);
    }

    private async buildView(scriptUri: vscode.Uri) {
        const settingBin = await vscode.workspace.fs.readFile(await getSettingFileUri(this.storageUri));
        const decoder = new TextDecoder();
        let settingText = decoder.decode(settingBin);

        try {
            JSON.parse(settingText);
        }
        catch {
            settingText = "{}"
        }

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
    <script>
    var setting = JSON.parse(\`
    ${settingText}
    \`);
    </script>
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