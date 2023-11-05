import * as vscode from 'vscode';
import * as lsp from 'vscode-languageclient/node';
import { BaseLanguageClient, LanguageClient, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import {
	ExecuteCommandRequest,
	LanguageClientOptions,
	RequestType,
	RevealOutputChannelOn,
	TextDocumentEdit,
	TextDocumentPositionParams,
	WorkspaceEdit as LSWorkspaceEdit
} from 'vscode-languageclient';
import { activateTagClosing } from './html/autoclosing';

namespace TagCloseRequest {
	export const type: RequestType<TextDocumentPositionParams, string, any> = new RequestType(
			'html/tag'
	);
}

let client: lsp.BaseLanguageClient;

export async function activate(context: vscode.ExtensionContext) {

	if (vscode.workspace.textDocuments.some((doc) => doc.languageId === 'nue')) {
		activateNueLanguageServer(context);
	} else {
		const onTextDocumentListener = vscode.workspace.onDidOpenTextDocument((doc) => {
			if (doc.languageId === 'nue') {
				activateNueLanguageServer(context);
				onTextDocumentListener.dispose();
			}
		});
		context.subscriptions.push(onTextDocumentListener);
	}

	// support for auto close tag
	// activateAutoInsertion([client], document => document.languageId === 'nue');

}

export function deactivate(): Thenable<any> | undefined {
	return client?.stop();
}

function activateNueLanguageServer(context: vscode.ExtensionContext) {
	const runtimeConfig = vscode.workspace.getConfiguration('nue.language-server');
	const serverModule = require.resolve('nuejs-language-server/bin/server.js');
	console.log('Loading server from ', serverModule);

	const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	const serverOptions: lsp.ServerOptions = {
			run: {
					module: serverModule,
					transport: TransportKind.ipc,
					options: {}
			},
			debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
	};

	const clientOptions: lsp.LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'nue' }],
		initializationOptions: {
			// typescript: { tsdk: require('path').join(vscode.env.appRoot, 'extensions/node_modules/typescript/lib') },
		},
	};
	client = new lsp.LanguageClient(
		'nuejs-language-server',
		'Nuejs Language Server',
		serverOptions,
		clientOptions,
	);

	console.log('client is starting', client);
	client.start().then(_ => {
		console.log('client started');
		const tagRequestor = (document: vscode.TextDocument, position: vscode.Position) => {
			const param = client.code2ProtocolConverter.asTextDocumentPositionParams(
					document,
					position
			);
			return client.sendRequest(TagCloseRequest.type, param);
		};
		const disposable = activateTagClosing(
				tagRequestor,
				{ nue: true },
				'html.autoClosingTags'
		);
		context.subscriptions.push(disposable);
	});
}
