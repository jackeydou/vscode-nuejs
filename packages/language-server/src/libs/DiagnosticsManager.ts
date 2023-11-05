import { _Connection, TextDocumentIdentifier, Diagnostic } from 'vscode-languageserver';
import { Document } from './documents/Document';
import { debounceThrottle } from '../utils';
// import { DocumentManager, Document } from './documents';

export type SendDiagnostics = _Connection['sendDiagnostics'];
export type GetDiagnostics = (uri: string) => void; // Thenable<Diagnostic[]>;

export class DiagnosticManager {
  constructor(
    private sendDiagnostics: SendDiagnostics,
    // private docManager: DocumentManager,
    private getDiagnostics: GetDiagnostics
  ) {}
  
  private pendingUpdates = new Set<Document>();

  private async update(document: Document) {
    await this.getDiagnostics(document.getURL());
    // this.sendDiagnostics({
    //     uri: document.getURL(),
    //     diagnostics
    // });
  }

  scheduleUpdate(document: Document) {
    this.pendingUpdates.add(document);
    this.scheduleBatchUpdate();
  }

  scheduleBatchUpdate = debounceThrottle(() => {
    this.pendingUpdates.forEach((doc) => {
      this.update(doc);
    });
    this.pendingUpdates.clear();
  }, 500);
}