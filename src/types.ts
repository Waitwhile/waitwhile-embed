export interface ZoidInstance {
  render: (selector: string) => void;
}

export interface ModalOptions {
  id?: string;
  confirmClose?: boolean;
  confirmMessage?: string;
  preload?: boolean;
  includeStyles?: boolean;
  modalOpenClass?: string;
}

export interface WaitwhileEmbed {
  mode?: 'registration' | 'display-waitlist';
  locationId: string;
  publicVisitId?: string;
  kiosk?: boolean;
  locale?: string;
  showHeader?: boolean;
  templateElements?: string[];
  stylesheets?: string[];
  host?: string;
  prefill?: Record<string, any>;
  onLocalesAvailable?: () => void;
  onRouteChanged?: () => void;
  onModalChanged?: () => void;
  onLocationStatusChanged?: () => void;
  onLocationAvailable?: () => void;
}

export interface Waitwhile {
  Embed: (opts: WaitwhileEmbed) => ZoidInstance;
  Modal: (
    embedOpts: WaitwhileEmbed,
    modalOpts?: ModalOptions,
  ) => {
    instance: ZoidInstance;
    dialog: {
      show: () => void;
      close: () => void;
    };
  };
  compileTemplates: () => string[];
  compileStylesheets: () => string[];
}
