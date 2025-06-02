// core/lifecycle/LifecycleManager.ts
export class PDFLifecycleManager<TEvents extends Record<string, any>> {
  private listeners: {
    [K in keyof TEvents]?: ((payload: TEvents[K]) => void)[]
  } = {};

  on<K extends keyof TEvents>(event: K, callback: (payload: TEvents[K]) => void) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.push(callback);
  }

  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]) {
    this.listeners[event]?.forEach(cb => cb(payload));
  }
}
