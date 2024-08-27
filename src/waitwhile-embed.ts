import '@krakenjs/zoid/dist/zoid.frame';
import {
  HOSTS,
  MODAL_MARKUP,
  MODAL_OPEN_CLASS,
  MODAL_STYLES,
} from './constants';
import type {
  ModalOptions,
  Waitwhile,
  WaitwhileEmbed,
  ZoidInstance,
} from './types';

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
        HOSTS[host as keyof typeof HOSTS] ||
        (typeof host === 'string' ? host : HOSTS.production);

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
