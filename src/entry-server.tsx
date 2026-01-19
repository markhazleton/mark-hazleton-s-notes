import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { AppProviders } from "./AppProviders";
import { AppRoutes } from "./AppRoutes";
import { HeadProvider } from "@/components/HeadProvider";
import { createHeadManager } from "@/lib/head-context";
import { BASE_PATH } from "@/lib/site";

export function render(url: string) {
  const headManager = createHeadManager();
  const basename = BASE_PATH === "/" ? undefined : BASE_PATH.replace(/\/$/, "");
  const location = basename ? `${basename}${url}` : url;
  const app = (
    <HeadProvider manager={headManager}>
      <AppProviders>
        <StaticRouter location={location} basename={basename}>
          <AppRoutes />
        </StaticRouter>
      </AppProviders>
    </HeadProvider>
  );

  const html = renderToString(app);
  
  const headParts: string[] = [];
  
  if (headManager.current) {
    headParts.push(`<title>${headManager.current.title}</title>`);
    
    headParts.push(
      ...headManager.current.metas.map((meta) => {
        const name = meta.name ? ` name="${meta.name}"` : "";
        const property = meta.property ? ` property="${meta.property}"` : "";
        return `<meta${name}${property} content="${meta.content}">`;
      })
    );
    
    headParts.push(
      ...headManager.current.links.map(
        (link) => `<link rel="${link.rel}" href="${link.href}">`
      )
    );
    
    // Add JSON-LD structured data
    if (headManager.current.jsonLd) {
      const jsonLdArray = Array.isArray(headManager.current.jsonLd)
        ? headManager.current.jsonLd
        : [headManager.current.jsonLd];
      
      jsonLdArray.forEach((schema) => {
        headParts.push(
          `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
        );
      });
    }
  }
  
  const head = headParts.join("");

  return { html, head };
}
