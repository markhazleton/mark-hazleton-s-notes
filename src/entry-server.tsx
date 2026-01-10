import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { AppProviders } from "./AppProviders";
import { AppRoutes } from "./AppRoutes";
import { HeadProvider } from "@/components/HeadProvider";
import { createHeadManager } from "@/lib/head-context";

export function render(url: string) {
  const headManager = createHeadManager();
  const app = (
    <HeadProvider manager={headManager}>
      <AppProviders>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </AppProviders>
    </HeadProvider>
  );

  const html = renderToString(app);
  const head = headManager.current
    ? [
        `<title>${headManager.current.title}</title>`,
        ...headManager.current.metas.map((meta) => {
          const name = meta.name ? ` name="${meta.name}"` : "";
          const property = meta.property ? ` property="${meta.property}"` : "";
          return `<meta${name}${property} content="${meta.content}">`;
        }),
        ...headManager.current.links.map(
          (link) => `<link rel="${link.rel}" href="${link.href}">`,
        ),
      ].join("")
    : "";

  return { html, head };
}
