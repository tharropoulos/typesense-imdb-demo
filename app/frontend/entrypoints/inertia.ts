import type { ReactNode } from "react";
import { createElement } from "react";
import { Layout } from "@/components/layout";
import { createInertiaApp, router } from "@inertiajs/react";
import { createRoot } from "react-dom/client";

// Temporary type definition, until @inertiajs/react provides one
interface ResolvedComponent {
  default: ReactNode;
  layout?: (page: ReactNode) => ReactNode;
}

router.on("navigate", () => {
  if (window.location.hash) {
    setTimeout(() => {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (!element) return;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 50 ;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }, 150);
  }
});

void createInertiaApp({
  // Set default page title
  // see https://inertia-rails.dev/guide/title-and-meta
  //
  // title: title => title ? `${title} - App` : 'App',

  // Disable progress bar
  //
  // see https://inertia-rails.dev/guide/progress-indicators
  // progress: false,

  resolve: (name) => {
    const pages = import.meta.glob<ResolvedComponent>("../pages/**/*.tsx", {
      eager: true,
    });
    const page = pages[`../pages/${name}.tsx`];
    if (!page) {
      console.error(`Missing Inertia page component: '${name}.tsx'`);
    }

    // To use a default layout, import the Layout component
    // and use the following line.
    // see https://inertia-rails.dev/guide/pages#default-layouts
    //
    page.default.layout ||= (page) => createElement(Layout, null, page);

    return page;
  },

  setup({ el, App, props }) {
    if (el) {
      createRoot(el).render(createElement(App, props));
    } else {
      console.error(
        "Missing root element.\n\n" +
          "If you see this error, it probably means you load Inertia.js on non-Inertia pages.\n" +
          'Consider moving <%= vite_typescript_tag "inertia" %> to the Inertia-specific layout instead.',
      );
    }
  },
});
