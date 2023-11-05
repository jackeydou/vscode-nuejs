import { Position } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { HTMLDocument } from 'vscode-html-languageservice';
import { getLineOffsets, offsetAt, positionAt } from './utils';
import { parseHTML } from '../parseHTML';

interface ComponentInfo {
  _id: string;
  impl: any;
  start: number;
  end: number;
  startPos: Position;
  endPos: Position;
  content: string;
  template: HTMLDocument;
}

export class Document implements TextDocument {
  constructor(public url: string, public content: string) {
    this.updateDocInfo();
  }

  languageId =  'nue';
  version = 0;
  protected lineOffsets?: number[];
  html!: HTMLDocument;
  componentsInfo: ComponentInfo[] = [];

  get uri(): string {
    return this.getURL();
  }

  getURL() {
    return this.url;
  }

  getText() {
    return this.content;
  }

  positionAt(offset: number): Position {
    return positionAt(offset, this.getText(), this.getLineOffsets());
  }

  offsetAt(position: Position): number {
    return offsetAt(position, this.getText(), this.getLineOffsets());
  }

  private getLineOffsets() {
    if (!this.lineOffsets) {
        this.lineOffsets = getLineOffsets(this.getText());
    }
    return this.lineOffsets;
  }

  get lineCount() {
    return this.getText().split(/\r?\n/).length;
  }

  // ---------------------------

  /**
   * Set the text content of the document.
   * Implementers should set `lineOffsets` to `undefined` here.
   * @param text The new text content
   */
  setText(text: string) {
    this.content = text;
    this.version++;
    this.lineOffsets = undefined;
    this.updateDocInfo();
  }

  /**
   * Update the text between two positions.
   * @param text The new text slice
   * @param start Start offset of the new text
   * @param end End offset of the new text
  */
  update(text: string, start: number, end: number): void {
    this.lineOffsets = undefined;
    const content = this.getText();
    this.setText(content.slice(0, start) + text + content.slice(end));
  }

  private updateDocInfo() {
    this.html = parseHTML(this.content);

  }

}