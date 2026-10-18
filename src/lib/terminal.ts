// Any component can open the mini-terminal without importing it.
export const TERMINAL_OPEN_EVENT = "terminal:open";

export function openTerminal() {
  window.dispatchEvent(new Event(TERMINAL_OPEN_EVENT));
}
