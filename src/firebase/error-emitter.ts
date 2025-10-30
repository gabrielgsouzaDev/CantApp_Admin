// src/firebase/error-emitter.ts

// A simple event emitter to broadcast errors globally.
type Listener = (error: Error) => void;

class ErrorEmitter {
  private listeners: { [event: string]: Listener[] } = {};

  on(event: string, listener: Listener): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  off(event: string, listener: Listener): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }

  emit(event: string, error: Error): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach(listener => listener(error));
  }
}

export const errorEmitter = new ErrorEmitter();
