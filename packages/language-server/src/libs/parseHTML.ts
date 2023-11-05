import { 
  getLanguageService,
  HTMLDocument
} from 'vscode-html-languageservice';

const htmlParser = getLanguageService();

export function parseHTML(text: string): HTMLDocument {
  const parsedDoc = htmlParser.parseHTMLDocument(<any>{ getText: () => text });
  return parsedDoc;
}


