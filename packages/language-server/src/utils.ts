import { URI } from 'vscode-uri';

/**
 * URIs coming from the client could be encoded in a different
 * way than expected / than the internal services create them.
 * This normalizes them to be the same as the internally generated ones.
 */
export function normalizeUri(uri: string): string {
  return URI.parse(uri).toString();
}

/**
 * Debounces a function but also waits at minimum the specified number of miliseconds until
 * the next invocation. This avoids needless calls when a synchronous call (like diagnostics)
 * took too long and the whole timeout of the next call was eaten up already.
 *
 * @param fn The function
 * @param miliseconds Number of miliseconds to debounce/throttle
 */
export function debounceThrottle(fn: () => void, miliseconds: number): () => void {
  let timeout: any;
  let lastInvocation = Date.now() - miliseconds;

  function maybeCall() {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
          if (Date.now() - lastInvocation < miliseconds) {
              maybeCall();
              return;
          }

          fn();
          lastInvocation = Date.now();
      }, miliseconds);
  }

  return maybeCall;
}