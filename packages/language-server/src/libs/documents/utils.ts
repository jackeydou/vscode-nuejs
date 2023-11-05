// https://github.com/sveltejs/language-tools/blob/83d92c56baa7b9ab0cdc3a19c645e0f9af8c437b/packages/language-server/src/lib/documents/utils.ts

import { Position } from 'vscode-languageserver';

export function getLineOffsets(text: string) {
  const lineOffsets = [];
  let isLineStart = true;

  for (let i = 0; i < text.length; i++) {
      if (isLineStart) {
          lineOffsets.push(i);
          isLineStart = false;
      }
      const ch = text.charAt(i);
      isLineStart = ch === '\r' || ch === '\n';
      if (ch === '\r' && i + 1 < text.length && text.charAt(i + 1) === '\n') {
          i++;
      }
  }

  if (isLineStart && text.length > 0) {
      lineOffsets.push(text.length);
  }

  return lineOffsets;
}

export function clamp(num: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, num));
}

export function positionAt(
  offset: number,
  text: string,
  lineOffsets = getLineOffsets(text)
): Position {
  offset = clamp(offset, 0, text.length);

  let low = 0;
  let high = lineOffsets.length;
  if (high === 0) {
      return Position.create(0, offset);
  }

  while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const lineOffset = lineOffsets[mid];

      if (lineOffset === offset) {
          return Position.create(mid, 0);
      } else if (offset > lineOffset) {
          low = mid + 1;
      } else {
          high = mid - 1;
      }
  }

  // low is the least x for which the line offset is larger than the current offset
  // or array.length if no line offset is larger than the current offset
  const line = low - 1;
  return Position.create(line, offset - lineOffsets[line]);
}

/**
 * Get the offset of the line and character position
 * @param position Line and character position
 * @param text The text for which the offset should be retrived
 * @param lineOffsets number Array with offsets for each line. Computed if not given
 */
export function offsetAt(
  position: Position,
  text: string,
  lineOffsets = getLineOffsets(text)
): number {
  if (position.line >= lineOffsets.length) {
      return text.length;
  } else if (position.line < 0) {
      return 0;
  }

  const lineOffset = lineOffsets[position.line];
  const nextLineOffset =
      position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : text.length;

  return clamp(nextLineOffset, lineOffset, lineOffset + position.character);
}
