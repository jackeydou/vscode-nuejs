import {
  Diagnostic,
} from 'vscode-languageserver';
import { Document } from "../../../libs/documents/Document";
import { parseHTML } from '../../../libs/parseHTML';

export function getDiagnostics({
  document,
}: {
  document: Document;
}) { // Promise<Diagnostic[]> {
  // return [];
  const parsedDoc = parseHTML(document.getText());
  console.log(parsedDoc);
}