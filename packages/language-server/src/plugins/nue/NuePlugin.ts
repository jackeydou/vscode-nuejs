import {
  Diagnostic,
} from 'vscode-languageserver';
import {
  TextDocumentContentChangeEvent,
  TextDocumentItem,
  VersionedTextDocumentIdentifier
} from 'vscode-languageserver';
import { Document } from "../../libs/documents/Document";
import { getDiagnostics } from "./features/getDiagnostics";

export class NuePlugin {
  private _docMap: Map<string, Document> = new Map();

  getDiagnostics = async (uri: string) => { //: Promise<Diagnostic[]> {
    return getDiagnostics({
      document: this._docMap.get(uri),
    });
  }

  openDocument(textDocument: Pick<TextDocumentItem, 'text' | 'uri'>): Document {
    const document = new Document(textDocument.uri, textDocument.text);
    this._docMap.set(textDocument.uri, document);
    return document;
  }

  updateDocument(
    textDocument: VersionedTextDocumentIdentifier,
    changes: TextDocumentContentChangeEvent[]
  ) {

  }

}