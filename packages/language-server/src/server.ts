import { ProposedFeatures, TextDocumentSyncKind, IPCMessageReader, IPCMessageWriter, createConnection } from 'vscode-languageserver/node';
import { NuePlugin } from './plugins/nue/NuePlugin';
import { DiagnosticManager } from './libs/DiagnosticsManager';

export function startLanguageServer() {
  // const connection = createConnection(
  //   new IPCMessageReader(process),
  //   new IPCMessageWriter(process),
  // );

  const connection = createConnection(ProposedFeatures.all);

  const nuePlugin = new NuePlugin();
  const diagnosticManager = new DiagnosticManager(
    connection.sendDiagnostics,
    nuePlugin.getDiagnostics,
  );

  console.log('connect server 2', connection)

  connection.onInitialize(_evt => {
    console.log('onInitialize')
    return {
      capabilities: {
        textDocumentSync: {
          openClose: true,
          change: TextDocumentSyncKind.Incremental,
          save: {
              includeText: false
          }
        },
        hoverProvider: true,
        completionProvider: {
          resolveProvider: true,
          triggerCharacters: [
            '.',
            '"',
            "'",
            '`',
            '/',
            '@',
            '<',
            '>',
            '*',
            '#',
            '$',
            '+',
            '^',
            '(',
            '[',
            '-',
            ':',
          ],
          completionItem: {
              labelDetailsSupport: true
          }
        },
      }
    }
  });

  connection.onInitialized(evt => {});

  connection.onHover(evt => {
    console.log('hover', evt)
    return null;
  })

  connection.onDidSaveTextDocument(evt => {
    console.log('onDidSaveTextDocument')
  });

  connection.onDidOpenTextDocument((evt) => {
    console.log('onDidOpenTextDocument')
    const document = nuePlugin.openDocument(evt.textDocument);
    diagnosticManager.scheduleUpdate(document);
  });

  connection.onDidChangeTextDocument((evt) => {
    console.log('onDidChangeTextDocument')
    nuePlugin.updateDocument(evt.textDocument, evt.contentChanges);
  });

  connection.onDidCloseTextDocument((evt) => {
    console.log('onDidCloseTextDocument')
  });

  connection.listen();
}