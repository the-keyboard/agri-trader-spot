// Simple global state for auth dialog - no external dependencies
interface AuthDialogState {
  isOpen: boolean;
  mode: 'login' | 'register';
  openLogin: () => void;
  openRegister: () => void;
  close: () => void;
}

// Simple global state for auth dialog - works without zustand too
let listeners: Set<() => void> = new Set();
let state = { isOpen: false, mode: 'login' as 'login' | 'register' };

function notify() {
  listeners.forEach((l) => l());
}

export function openLoginDialog() {
  state = { isOpen: true, mode: 'login' };
  notify();
}

export function openRegisterDialog() {
  state = { isOpen: true, mode: 'register' };
  notify();
}

export function closeAuthDialog() {
  state = { ...state, isOpen: false };
  notify();
}

export function getAuthDialogState() {
  return state;
}

export function subscribeAuthDialog(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
