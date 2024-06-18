import "zoid/dist/zoid.frame";

declare global {
  interface Window {
    Waitwhile: {
      Embed: any;
      compileTemplates: () => string[];
      compileStylesheets: () => string[];
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
      "Waitwhile requires zoid to be included on the page. See https://cdnjs.com/libraries/zoid."
    );
  }

  const hosts = {
    production: "https://waitwhile.com",
    development: "https://ww-static-public-dev.web.app",
  };

  const Embed = zoid.create({
    tag: "waitwhile",
    props: {
      locationId: {
        type: "string",
      },
      publicVisitId: {
        type: "string",
        required: false,
      },
      kiosk: {
        type: "boolean",
        queryParam: true,
        required: false,
      },
      locale: {
        type: "string",
        required: false,
      },
      showHeader: {
        type: "boolean",
        required: false,
        default: () => true,
      },
      templateElements: {
        type: "array",
        required: false,
      },
      stylesheets: {
        type: "array",
        required: false,
      },
      host: {
        type: "string",
        required: false,
      },
      onLocalesAvailable: {
        type: "function",
        required: false,
      },
      onRouteChanged: {
        type: "function",
        required: false,
      },
      onModalChanged: {
        type: "function",
        required: false,
      },
      onLocationStatusChanged: {
        type: "function",
        required: false,
      },
      onLocationAvailable: {
        type: "function",
        required: false,
      },
    },
    dimensions: {
      width: "100%",
      height: "300px",
    },
    autoResize: {
      width: false,
      height: true,
    },
    attributes: {
      iframe: {
        allow: "geolocation",
        scrolling: "no",
      },
    },
    url: ({
      props,
    }: {
      props: { host?: string; locationId: string; publicVisitId?: string };
    }) => {
      const { host, locationId, publicVisitId } = props;
      const root =
        hosts[host as keyof typeof hosts] ||
        (typeof host === "string" ? host : hosts.production);

      if (publicVisitId) {
        return `${root}/locations/${locationId}/visits/${publicVisitId}`;
      }

      return `${root}/locations/${locationId}`;
    },
  });

  const elementsToString = (selector: string, prop = "outerHTML") => {
    const elements = document.querySelectorAll(selector);
    return Array.from(elements)
      .map((el) => el[prop as keyof typeof el] as unknown as string | null)
      .filter(Boolean) as string[];
  };

  const compileTemplates = () => elementsToString("div[data-ww-slot]");

  const compileStylesheets = () =>
    elementsToString("style[data-ww-css]", "innerHTML");

  root.Waitwhile = {
    Embed,
    compileTemplates,
    compileStylesheets,
  };
})(typeof window !== "undefined" ? window : undefined);
