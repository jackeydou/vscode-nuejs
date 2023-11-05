// import {
//   CallHierarchyIncomingCall,
//   CallHierarchyItem,
//   CallHierarchyOutgoingCall,
//   CodeAction,
//   CodeActionContext,
//   Color,
//   ColorInformation,
//   ColorPresentation,
//   CompletionItem,
//   CompletionList,
//   DefinitionLink,
//   Diagnostic,
//   FormattingOptions,
//   Hover,
//   InlayHint,
//   Location,
//   Position,
//   Range,
//   ReferenceContext,
//   SelectionRange,
//   SignatureHelp,
//   SymbolInformation,
//   TextDocumentIdentifier,
//   TextEdit,
//   WorkspaceEdit
// } from 'vscode-languageserver-types';

// export interface CompletionsProvider<T extends TextDocumentIdentifier = any> {
//   getCompletions(
//       document: Document,
//       position: Position,
//       completionContext?: CompletionContext,
//       cancellationToken?: CancellationToken
//   ): Resolvable<AppCompletionList<T> | null>;

//   resolveCompletion?(
//       document: Document,
//       completionItem: AppCompletionItem<T>,
//       cancellationToken?: CancellationToken
//   ): Resolvable<AppCompletionItem<T>>;
// }