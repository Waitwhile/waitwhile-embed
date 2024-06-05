declare global {
  interface Window {
    translations: Record<string, unknown>;
    webkit?: {
      messageHandlers?: {
        visitCreated: {
          postMessage: (visit: any) => void;
        };
      };
    };
    Waitwhile: any;
    zoid: any;
  }
}
export {};

