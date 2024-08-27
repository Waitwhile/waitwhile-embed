import '@krakenjs/zoid/dist/zoid.frame';
import { ModalOptions, Waitwhile, WaitwhileEmbed, ZoidInstance } from './types';

declare global {
  interface Window {
    Waitwhile: Waitwhile;
    zoid: any;
  }
}

const initWaitwhile = (root: Window | undefined): void => {
  if (!root || root.Waitwhile) {
    return;
  }

  const { zoid } = root;

  if (!zoid) {
    throw new Error(
      'Waitwhile requires zoid to be included on the page. See https://cdnjs.com/libraries/zoid.',
    );
  }

  const MODAL_MARKUP = `
    <div class="waitwhile-modal-content"></div>
  `;

  const MODAL_OPEN_CLASS = 'waitwhile-modal-open';

  const MODAL_STYLES = `
  @keyframes ww-modal-in {
    from {
      transform: translateY(1vh) scale(0.98);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }

  @keyframes ww-modal-o-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  body.${MODAL_OPEN_CLASS} {
    overflow: hidden;
    overscroll-behavior: contain;
    pointer-events: none;
  }

  .waitwhile-modal {
    pointer-events: all;
    position: fixed;
    width: 100%;
    min-width: 100%;
    height: 100%;
    min-height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: none;
    margin: 0;
    padding: 0 16px;
    transform: translateY(1vh) scale(0.98);
    opacity: 0;
    background: transparent;
  }
  .waitwhile-modal::backdrop {
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(0.35rem);
    overflow: scroll;
  }
  .waitwhile-modal[open] {
    animation: ww-modal-in 350ms ease-out forwards;
    animation-delay: 150ms;
    &::backdrop {
      animation: ww-modal-o-in 250ms ease-out;
    }
  }

  .waitwhile-modal-content {
    margin: 5% auto;
    margin: 5vh auto;
    padding: 16px 16px 48px 16px;
    width: 100%;
    max-width: 771px;
    min-height: 400px;
    border-radius: 4px;
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    background: #fff;
  }
  `;

  const hosts: Record<string, string> = {
    production: 'https://waitwhile.com',
    development: 'https://ww-static-public-dev.web.app',
  };

  const Embed: (opts: WaitwhileEmbed) => ZoidInstance = zoid.create({
    tag: 'waitwhile',
    props: {
      locationId: {
        type: 'string',
      },
      publicVisitId: {
        type: 'string',
        required: false,
      },
      kiosk: {
        type: 'boolean',
        queryParam: true,
        required: false,
      },
      locale: {
        type: 'string',
        required: false,
      },
      showHeader: {
        type: 'boolean',
        required: false,
        default: () => true,
      },
      templateElements: {
        type: 'array',
        required: false,
      },
      stylesheets: {
        type: 'array',
        required: false,
      },
      host: {
        type: 'string',
        required: false,
      },
      prefill: {
        type: 'object',
        required: false,
      },
      onLocalesAvailable: {
        type: 'function',
        required: false,
      },
      onRouteChanged: {
        type: 'function',
        required: false,
      },
      onModalChanged: {
        type: 'function',
        required: false,
      },
      onLocationStatusChanged: {
        type: 'function',
        required: false,
      },
      onLocationAvailable: {
        type: 'function',
        required: false,
      },
    },
    dimensions: {
      width: '100%',
      height: '300px',
    },
    autoResize: {
      width: false,
      height: true,
    },
    attributes: {
      iframe: {
        allow: 'geolocation',
        scrolling: 'no',
      },
    },
    url: ({ props }: { props: WaitwhileEmbed }) => {
      const { host, locationId, publicVisitId, prefill } = props;

      const root =
        hosts[host as keyof typeof hosts] ||
        (typeof host === 'string' ? host : hosts.production);

      if (publicVisitId) {
        return `${root}/locations/${locationId}/visits/${publicVisitId}`;
      }

      const query = prefill
        ? `?${new URLSearchParams(prefill).toString()}`
        : '';

      return `${root}/locations/${locationId}${query}`;
    },
  });

  let modalCount = 0;

  const Modal = (
    embedOpts: WaitwhileEmbed,
    modalOpts: ModalOptions = {},
  ): {
    instance: ZoidInstance;
    dialog: {
      show: () => void;
      close: () => void;
    };
  } => {
    const defaultModalOpts: Required<ModalOptions> = {
      id: `waitwhile-modal-${modalCount++}`,
      confirmClose: true,
      confirmMessage: 'Are you sure you want to close?',
      preload: false,
      includeStyles: true,
      modalOpenClass: MODAL_OPEN_CLASS,
    };

    const options = { ...defaultModalOpts, ...modalOpts };

    if (options.includeStyles && modalCount === 1) {
      const styleSheet = document.createElement('style');
      styleSheet.textContent = MODAL_STYLES;
      document.head.appendChild(styleSheet);
    }

    let isRendered = false;
    const instance = Embed(embedOpts);

    if (document.getElementById(options.id)) {
      throw new Error(`Modal with id ${options.id} already exists`);
    }

    const dialog = document.createElement('dialog');
    dialog.id = options.id;
    dialog.className = 'waitwhile-modal';
    dialog.innerHTML = MODAL_MARKUP;

    dialog.addEventListener('click', (event: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      const isOverlayClick =
        (event.target as HTMLElement)?.tagName === 'DIALOG' &&
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (
        isOverlayClick &&
        (!options.confirmClose || window.confirm(options.confirmMessage))
      ) {
        close();
      }
    });

    dialog.addEventListener('close', () => {
      document.body.classList.remove(options.modalOpenClass);
    });

    document.body.append(dialog);

    const renderInstance = (): void => {
      instance.render(`#${options.id} .waitwhile-modal-content`);
      isRendered = true;
    };

    const show = (): void => {
      const modalElement = document.getElementById(
        options.id,
      ) as HTMLDialogElement | null;
      if (!modalElement) return;

      if (!isRendered) {
        renderInstance();
      }
      modalElement.showModal();
      document.body.classList.add(options.modalOpenClass);
    };

    const close = (): void => {
      const modalElement = document.getElementById(
        options.id,
      ) as HTMLDialogElement | null;
      if (!modalElement) return;

      modalElement.close();
    };

    if (options.preload) {
      renderInstance();
    }

    return {
      instance,
      dialog: {
        show,
        close,
      },
    };
  };

  const elementsToString = (selector: string, prop = 'outerHTML'): string[] => {
    return Array.from(document.querySelectorAll(selector))
      .map((el) => el[prop as keyof Element] as string | null)
      .filter((content): content is string => content !== null);
  };

  const compileTemplates = (): string[] =>
    elementsToString('div[data-ww-slot]');

  const compileStylesheets = (): string[] =>
    elementsToString('style[data-ww-css]', 'innerHTML');

  root.Waitwhile = {
    Embed,
    Modal,
    compileTemplates,
    compileStylesheets,
  };
};

if (typeof window !== 'undefined') {
  initWaitwhile(window);
}
