import '@krakenjs/zoid/dist/zoid.frame';

type ZoidEmbed = any;

type ModalOpts = {
  id?: string;
  confirmClose?: boolean;
  confirmMessage?: string;
  preload?: boolean;
  modalOpenClass?: string;
};

declare global {
  interface Window {
    Waitwhile: {
      Embed: ZoidEmbed;
      compileTemplates: () => string[];
      compileStylesheets: () => string[];
      Modal: (
        embedOpts: any,
        modalOpts?: ModalOpts,
      ) => {
        embed: ZoidEmbed;
        dialog: {
          show: () => void;
          close: () => void;
        };
      };
    };
    zoid: any;
  }
}

(function initWaitwhile(root) {
  if (!root || root.Waitwhile) {
    return;
  }

  const zoid = root.zoid;

  if (!zoid) {
    throw new Error(
      'Waitwhile requires zoid to be included on the page. See https://cdnjs.com/libraries/zoid.',
    );
  }

  const MODAL_TEMPLATE = `
    <div class="waitwhile-modal-content"></div>
  `;

  const MODAL_OPEN_CLASS = 'waitwhile-modal-open';

  const hosts = {
    production: 'https://waitwhile.com',
    development: 'https://ww-static-public-dev.web.app',
  };

  const Embed = zoid.create({
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
    url: ({
      props,
    }: {
      props: {
        host?: string;
        locationId: string;
        publicVisitId?: string;
        prefill?: Record<string, any>;
      };
    }) => {
      const { host, locationId, publicVisitId, prefill } = props;

      const root =
        hosts[host as keyof typeof hosts] ||
        (typeof host === 'string' ? host : hosts.production);

      if (publicVisitId) {
        return `${root}/locations/${locationId}/visits/${publicVisitId}`;
      }

      let query = '';
      if (prefill) {
        const params = new URLSearchParams(prefill);
        query = `?${params.toString()}`;
      }

      return `${root}/locations/${locationId}${query}`;
    },
  });

  let modalCount = 0;

  const Modal = (embedOpts: any, modalOpts: ModalOpts = {}) => {
    const defaultModalOpts = {
      confirmClose: true,
      confirmMessage: 'Are you sure you want to close?',
      modalOpenClass: MODAL_OPEN_CLASS,
    };

    modalOpts = {
      ...defaultModalOpts,
      ...modalOpts,
    };

    let isRendered = false;
    let id = modalOpts.id || `waitwhile-modal-${modalCount++}`;
    const embed = Embed(embedOpts);

    if (document.getElementById(id)) {
      throw new Error(`Modal with id ${id} already exists`);
    }

    const dialog = document.createElement('dialog');
    dialog.setAttribute('id', id);
    dialog.setAttribute('class', 'waitwhile-modal');
    dialog.innerHTML = MODAL_TEMPLATE;
    dialog.addEventListener('click', (event: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog =
        (event.target as HTMLElement)?.tagName === 'DIALOG' &&
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (
        isInDialog &&
        (!modalOpts.confirmClose || window.confirm(modalOpts.confirmMessage))
      ) {
        close();
      }
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove(modalOpts.modalOpenClass!);
    });
    document.body.append(dialog);

    const renderEmbed = () => {
      embed.render(`#${id} .waitwhile-modal-content`);
      isRendered = true;
    };

    const show = () => {
      const dialog = document.getElementById(id) as HTMLDialogElement;
      if (!dialog) {
        return;
      }
      if (!isRendered) {
        renderEmbed();
      }
      dialog.showModal();
      document.body.classList.add(modalOpts.modalOpenClass!);
    };

    const close = () => {
      const dialog = document.getElementById(id) as HTMLDialogElement;
      if (!dialog) {
        return;
      }
      dialog.close();
    };

    if (modalOpts.preload) {
      renderEmbed();
    }

    return {
      embed,
      dialog: {
        show,
        close,
      },
    };
  };

  const elementsToString = (selector: string, prop = 'outerHTML') => {
    const elements = document.querySelectorAll(selector);
    return Array.from(elements)
      .map((el) => el[prop as keyof typeof el] as unknown as string | null)
      .filter(Boolean) as string[];
  };

  const compileTemplates = () => elementsToString('div[data-ww-slot]');

  const compileStylesheets = () =>
    elementsToString('style[data-ww-css]', 'innerHTML');

  root.Waitwhile = {
    Embed,
    Modal,
    compileTemplates,
    compileStylesheets,
  };
})(typeof window !== 'undefined' ? window : undefined);
